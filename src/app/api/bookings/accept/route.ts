import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

// Fee structure based on service type
const BOOKING_FEES = {
    'bao-xe': 140000,  // Charter booking fee
    'xe-ghep': 25000,  // Shared ride fee
};

export async function POST(request: Request) {
    try {
        // 1. Verify Driver Auth
        const cookieStore = await cookies();
        const driverId = cookieStore.get('driver_token')?.value;

        if (!driverId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { bookingId } = await request.json();

        if (!bookingId) {
            return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 });
        }

        // 2. Fetch Booking & Check Status (moved up to get service_type)
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .select('*')
            .eq('id', bookingId)
            .single();

        if (bookingError || !booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (booking.status !== 'pending') {
            return NextResponse.json({ error: 'Chuyến đi này đã có người nhận!' }, { status: 409 });
        }

        // Determine fee based on service type
        const bookingFee = BOOKING_FEES[booking.service_type as keyof typeof BOOKING_FEES] || BOOKING_FEES['xe-ghep'];

        // 3. Fetch Driver & Check Balance
        const { data: driver, error: driverError } = await supabase
            .from('drivers')
            .select('*')
            .eq('id', driverId)
            .single();

        if (driverError || !driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        if (driver.wallet_balance < bookingFee) {
            return NextResponse.json({ error: 'Số dư không đủ. Vui lòng nạp thêm tiền.' }, { status: 400 });
        }

        // 4. Perform Transaction (Sequential for MVP)
        // A. Deduct Wallet
        const { error: updateWalletError } = await supabase
            .from('drivers')
            .update({ wallet_balance: driver.wallet_balance - bookingFee })
            .eq('id', driverId);

        if (updateWalletError) {
            throw new Error('Failed to update wallet');
        }

        // B. Record Transaction
        const serviceTypeName = booking.service_type === 'bao-xe' ? 'Bao Xe' : 'Xe Ghép';
        await supabase
            .from('driver_transactions')
            .insert([
                {
                    driver_id: driverId,
                    amount: -bookingFee,
                    type: 'booking_fee',
                    description: `Phí nhận chuyến ${serviceTypeName}: ${booking.pickup_address} -> ${booking.dropoff_address || '...'}`
                }
            ]);

        // C. Update Booking Status
        const { data: updatedBooking, error: updateBookingError } = await supabase
            .from('bookings')
            .update({
                status: 'confirmed',
                driver_id: driverId
            })
            .eq('id', bookingId)
            .select()
            .single();

        if (updateBookingError) {
            // Rollback wallet (simplified)
            await supabase
                .from('drivers')
                .update({ wallet_balance: driver.wallet_balance }) // Restore balance
                .eq('id', driverId);

            throw new Error('Failed to update booking');
        }

        return NextResponse.json({
            success: true,
            booking: updatedBooking,
            message: 'Nhận chuyến thành công! Hãy liên hệ ngay với khách hàng.'
        });

    } catch (error) {
        console.error('Accept booking API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

const BOOKING_FEE = 25000;

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

        // 2. Fetch Driver & Check Balance
        const { data: driver, error: driverError } = await supabase
            .from('drivers')
            .select('*')
            .eq('id', driverId)
            .single();

        if (driverError || !driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        if (driver.wallet_balance < BOOKING_FEE) {
            return NextResponse.json({ error: 'Số dư không đủ. Vui lòng nạp thêm tiền.' }, { status: 400 });
        }

        // 3. Fetch Booking & Check Status
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

        // 4. Perform Transaction (Sequential for MVP)
        // A. Deduct Wallet
        const { error: updateWalletError } = await supabase
            .from('drivers')
            .update({ wallet_balance: driver.wallet_balance - BOOKING_FEE })
            .eq('id', driverId);

        if (updateWalletError) {
            throw new Error('Failed to update wallet');
        }

        // B. Record Transaction
        await supabase
            .from('driver_transactions')
            .insert([
                {
                    driver_id: driverId,
                    amount: -BOOKING_FEE,
                    type: 'booking_fee',
                    description: `Phí nhận chuyến: ${booking.pickup_address} -> ${booking.dropoff_address || '...'}`
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

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        // 1. Verify Driver Auth
        const cookieStore = await cookies();
        const driverId = cookieStore.get('driver_token')?.value;

        if (!driverId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Get Query Params (Optional: Filter by location)
        const { searchParams } = new URL(request.url);
        const location = searchParams.get('location'); // 'hanoi' or 'thanhhoa'

        // 3. Build Query
        let query = supabase
            .from('bookings')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });

        if (location) {
            // Driver in Hanoi → Show bookings FROM Hanoi TO Thanh Hoa (hn-th)
            // Driver in Thanh Hoa → Show bookings FROM Thanh Hoa TO Hanoi (th-hn)
            const direction = location === 'hanoi' ? 'hn-th' : 'th-hn';
            console.log(`[DEBUG] Driver location: ${location}, filtering for direction: ${direction}`);
            query = query.eq('direction', direction);
        } else {
            console.log('[DEBUG] No location filter - showing all bookings');
        }

        const { data: bookings, error } = await query;

        console.log(`[DEBUG] Query result: ${bookings?.length || 0} bookings found`);
        if (bookings && bookings.length > 0) {
            console.log('[DEBUG] Bookings:', bookings.map(b => ({
                id: b.id.slice(0, 8),
                direction: b.direction,
                pickup: b.pickup_address.slice(0, 30)
            })));
        }

        if (error) {
            console.error('Fetch bookings error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // 4. Mask Phone Numbers
        const maskedBookings = bookings?.map(booking => ({
            ...booking,
            phone: booking.phone.slice(0, -3) + '***', // Mask last 3 digits
            full_phone_hidden: true
        }));

        return NextResponse.json({ bookings: maskedBookings });

    } catch (error) {
        console.error('Available bookings API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

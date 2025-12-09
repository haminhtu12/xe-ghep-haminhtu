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
            // If driver is in Hanoi, show bookings going TO Thanh Hoa (hn-th)
            // If driver is in Thanh Hoa, show bookings going TO Hanoi (th-hn)
            const direction = location === 'hanoi' ? 'hn-th' : 'th-hn';
            query = query.eq('direction', direction);
        }

        const { data: bookings, error } = await query;

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


import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        const cookieStore = await cookies();
        const driverId = cookieStore.get('driver_token')?.value;

        if (!driverId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch bookings for this driver
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .eq('driver_id', driverId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching my bookings:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('Error in my-bookings API:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const driverId = cookieStore.get('driver_token')?.value;

        if (!driverId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: driver, error } = await supabase
            .from('drivers')
            .select('*')
            .eq('id', driverId)
            .single();

        if (error || !driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        return NextResponse.json({ driver });

    } catch (error) {
        console.error('Get driver error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

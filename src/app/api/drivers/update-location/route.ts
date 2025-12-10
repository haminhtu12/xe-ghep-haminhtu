import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const driverId = cookieStore.get('driver_token')?.value;

        if (!driverId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { current_location } = await request.json();

        if (!current_location || !['hanoi', 'thanhhoa'].includes(current_location)) {
            return NextResponse.json({ error: 'Invalid location' }, { status: 400 });
        }

        // Update driver location
        const { error } = await supabase
            .from('drivers')
            .update({ current_location })
            .eq('id', driverId);

        if (error) {
            console.error('Update location error:', error);
            return NextResponse.json({ error: 'Failed to update location' }, { status: 500 });
        }

        return NextResponse.json({ success: true, current_location });

    } catch (error) {
        console.error('Update location API error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

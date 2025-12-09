import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Lấy danh sách tất cả đơn hàng
export async function GET() {
    try {
        const { data: bookings, error } = await supabase
            .from('bookings')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
        }

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// PATCH: Cập nhật trạng thái đơn hàng
export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json();

        if (!id || !status) {
            return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('bookings')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
        }

        return NextResponse.json({ booking: data });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

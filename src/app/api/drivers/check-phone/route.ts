import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { phone } = await request.json();

        if (!phone) {
            return NextResponse.json(
                { error: 'Thiếu thông tin số điện thoại' },
                { status: 400 }
            );
        }

        // Normalize phone to 0xxx format
        const normalizedPhone = phone.startsWith('+84')
            ? '0' + phone.slice(3)
            : phone;

        // Check if driver exists
        const { data: existingDriver } = await supabase
            .from('drivers')
            .select('id')
            .eq('phone', normalizedPhone)
            .single();

        return NextResponse.json({
            exists: !!existingDriver,
            phone: normalizedPhone
        });

    } catch (error) {
        console.error('Check phone error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}

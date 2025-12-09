import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { phone, otp } = await request.json();

        if (!phone || !otp) {
            return NextResponse.json({ error: 'Vui lòng nhập số điện thoại và mã OTP' }, { status: 400 });
        }

        // --- MOCK OTP VALIDATION ---
        // In production, verify against SMS provider or DB
        if (otp !== '123456') {
            return NextResponse.json({ error: 'Mã OTP không chính xác' }, { status: 400 });
        }

        // 1. Check if driver exists
        const { data: existingDriver } = await supabase
            .from('drivers')
            .select('*')
            .eq('phone', phone)
            .single();

        if (existingDriver) {
            // --- LOGIN FLOW ---
            // Set cookie
            const cookieStore = await cookies();
            cookieStore.set('driver_token', existingDriver.id, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });

            return NextResponse.json({
                success: true,
                driver: existingDriver,
                message: 'Đăng nhập thành công'
            });
        } else {
            // --- REGISTER FLOW (Auto-create) ---

            // 1. Create Driver
            const { data: newDriver, error: createError } = await supabase
                .from('drivers')
                .insert([
                    {
                        phone,
                        // password: 'NO_PASSWORD_OTP_ONLY', // Removed password requirement
                        name: `Tài xế ${phone.slice(-4)}`, // Default name
                        car_type: 'Chưa cập nhật',
                        license_plate: 'Chưa cập nhật',
                        wallet_balance: 500000, // BONUS 500k
                        status: 'approved' // Auto approve for MVP
                    }
                ])
                .select()
                .single();

            if (createError) {
                console.error('Create driver error:', createError);
                return NextResponse.json({ error: 'Lỗi tạo tài khoản' }, { status: 500 });
            }

            // 2. Create Transaction Record (Bonus)
            await supabase
                .from('driver_transactions')
                .insert([
                    {
                        driver_id: newDriver.id,
                        amount: 500000,
                        type: 'bonus',
                        description: 'Thưởng thành viên mới'
                    }
                ]);

            // Set cookie
            const cookieStore = await cookies();
            cookieStore.set('driver_token', newDriver.id, {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });

            return NextResponse.json({
                success: true,
                driver: newDriver,
                isNew: true,
                message: 'Đăng ký mới thành công! Bạn được tặng 500k vào ví.'
            });
        }

    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

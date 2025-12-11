import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { phone, password } = await request.json();

        if (!phone || !password) {
            return NextResponse.json(
                { error: 'Vui lòng nhập số điện thoại và mật khẩu' },
                { status: 400 }
            );
        }

        // Normalize phone
        const normalizedPhone = phone.startsWith('+84')
            ? '0' + phone.slice(3)
            : phone;

        // Find driver by phone
        const { data: driver, error: driverError } = await supabase
            .from('drivers')
            .select('*')
            .eq('phone', normalizedPhone)
            .single();

        if (driverError || !driver) {
            return NextResponse.json(
                { error: 'Số điện thoại chưa đăng ký' },
                { status: 401 }
            );
        }

        // Check if driver has password set
        if (!driver.password) {
            return NextResponse.json(
                { error: 'Tài khoản chưa đặt mật khẩu. Vui lòng đăng nhập bằng OTP để thiết lập mật khẩu.' },
                { status: 400 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, driver.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Mật khẩu không đúng' },
                { status: 401 }
            );
        }

        // Create session
        const cookieStore = await cookies();
        cookieStore.set('driver_token', driver.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return NextResponse.json({
            success: true,
            driver: {
                id: driver.id,
                name: driver.name,
                phone: driver.phone,
                wallet_balance: driver.wallet_balance,
            },
            message: 'Đăng nhập thành công!',
        });

    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { phone, password } = await request.json();

        if (!phone) {
            return NextResponse.json(
                { error: 'Thiếu thông tin số điện thoại' },
                { status: 400 }
            );
        }

        // Normalize phone: Firebase returns +84... we need 0... for DB?
        // Actually the DB uses '0xxx'. 
        // Firebase returns E.164 (+84).
        // Let's normalize to '0xxx'.
        const normalizedPhone = phone.startsWith('+84')
            ? '0' + phone.slice(3)
            : phone;

        // Check if driver exists
        const { data: existingDriver } = await supabase
            .from('drivers')
            .select('*')
            .eq('phone', normalizedPhone)
            .single();

        let driver;
        let isNew = false;

        if (!existingDriver) {
            // For NEW driver: check if password is provided
            if (!password) {
                // Client confirmed phone via Firebase. But user not in DB.
                // Ask client to provide password to create account.
                return NextResponse.json({
                    success: true,
                    isNew: true,
                    needPassword: true,
                    message: 'Xác thực thành công! Vui lòng tạo mật khẩu để hoàn tất đăng ký.',
                });
            }

            // Validate password strength
            if (password.length < 6) {
                return NextResponse.json(
                    { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
                    { status: 400 }
                );
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create new driver with 150k bonus (auto-approved)
            const { data: newDriver, error: createError } = await supabase
                .from('drivers')
                .insert({
                    phone: normalizedPhone,
                    password: hashedPassword,
                    name: `Tài xế ${normalizedPhone.slice(-4)}`,
                    wallet_balance: 150000,
                    status: 'approved', // Auto-approve new drivers
                    car_type: '4-seat', // Default car type
                    license_plate: 'PENDING', // Placeholder
                    current_location: 'hanoi',
                })
                .select()
                .single();

            if (createError) {
                console.error('Create driver error:', createError);
                return NextResponse.json(
                    { error: 'Không thể tạo tài khoản. Vui lòng thử lại.' },
                    { status: 500 }
                );
            }

            // Create transaction record
            await supabase.from('driver_transactions').insert({
                driver_id: newDriver.id,
                amount: 150000,
                type: 'bonus',
                description: 'Thưởng thành viên mới',
            });

            driver = newDriver;
            isNew = true;
        } else {
            // Existing driver login
            driver = existingDriver;
        }

        // Create session token (just store driver ID)
        const cookieStore = await cookies();
        cookieStore.set('driver_token', driver.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 30, // 30 days
        });

        return NextResponse.json({
            success: true,
            isNew,
            driver: {
                id: driver.id,
                name: driver.name,
                phone: driver.phone,
                wallet_balance: driver.wallet_balance,
            },
            message: isNew
                ? 'Đăng ký thành công! Bạn được tặng 150.000đ vào ví.'
                : 'Đăng nhập thành công!',
        });

    } catch (error) {
        console.error('Firebase Login error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}

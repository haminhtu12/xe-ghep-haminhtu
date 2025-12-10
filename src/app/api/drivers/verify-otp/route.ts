import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const { phone, otp } = await request.json();

        if (!phone || !otp) {
            return NextResponse.json(
                { error: 'Thiếu thông tin số điện thoại hoặc mã OTP' },
                { status: 400 }
            );
        }

        // Normalize phone
        const normalizedPhone = phone.startsWith('+84')
            ? '0' + phone.slice(3)
            : phone;

        // Find valid OTP
        const { data: otpRecords, error: otpError } = await supabase
            .from('otp_codes')
            .select('*')
            .eq('phone', normalizedPhone)
            .eq('verified', false)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })
            .limit(1);

        if (otpError || !otpRecords || otpRecords.length === 0) {
            return NextResponse.json(
                { error: 'Mã OTP không hợp lệ hoặc đã hết hạn' },
                { status: 400 }
            );
        }

        const otpRecord = otpRecords[0];

        // Check max attempts (5 attempts)
        if (otpRecord.attempts >= 5) {
            return NextResponse.json(
                { error: 'Bạn đã nhập sai quá nhiều lần. Vui lòng yêu cầu mã OTP mới.' },
                { status: 400 }
            );
        }

        // Verify OTP
        if (otpRecord.otp_code !== otp) {
            // Increment attempts
            await supabase
                .from('otp_codes')
                .update({ attempts: otpRecord.attempts + 1 })
                .eq('id', otpRecord.id);

            return NextResponse.json(
                { error: `Mã OTP không đúng. Bạn còn ${4 - otpRecord.attempts} lần thử.` },
                { status: 400 }
            );
        }

        // Mark OTP as verified
        await supabase
            .from('otp_codes')
            .update({ verified: true })
            .eq('id', otpRecord.id);

        // Check if driver exists
        const { data: existingDriver } = await supabase
            .from('drivers')
            .select('*')
            .eq('phone', normalizedPhone)
            .single();

        let driver;
        let isNew = false;

        if (!existingDriver) {
            // Create new driver with 150k bonus
            const { data: newDriver, error: createError } = await supabase
                .from('drivers')
                .insert({
                    phone: normalizedPhone,
                    name: `Tài xế ${normalizedPhone.slice(-4)}`,
                    wallet_balance: 150000,
                    status: 'active',
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
            driver = existingDriver;
        }

        // Create session token
        const token = Buffer.from(JSON.stringify({
            driverId: driver.id,
            phone: driver.phone
        })).toString('base64');

        const cookieStore = await cookies();
        cookieStore.set('driver_token', token, {
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
        console.error('Verify OTP error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}

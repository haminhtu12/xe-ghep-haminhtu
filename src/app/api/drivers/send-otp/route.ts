import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const SPEEDSMS_ACCESS_TOKEN = process.env.SPEEDSMS_ACCESS_TOKEN!;
const SPEEDSMS_API_URL = 'https://api.speedsms.vn/index.php/sms/send';

export async function POST(request: Request) {
    try {
        const { phone } = await request.json();

        // Validate phone number (Vietnamese format)
        const phoneRegex = /^(0|\+84)[3|5|7|8|9][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            return NextResponse.json(
                { error: 'Số điện thoại không hợp lệ' },
                { status: 400 }
            );
        }

        // Normalize phone (remove +84, add 0)
        const normalizedPhone = phone.startsWith('+84')
            ? '0' + phone.slice(3)
            : phone;

        // Check rate limiting: max 3 OTP requests per phone per 5 minutes
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        const { data: recentOtps, error: rateLimitError } = await supabase
            .from('otp_codes')
            .select('id')
            .eq('phone', normalizedPhone)
            .gte('created_at', fiveMinutesAgo.toISOString());

        if (rateLimitError) {
            console.error('Rate limit check error:', rateLimitError);
        }

        if (recentOtps && recentOtps.length >= 3) {
            return NextResponse.json(
                { error: 'Bạn đã yêu cầu quá nhiều mã OTP. Vui lòng thử lại sau 5 phút.' },
                { status: 429 }
            );
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to database with 5-minute expiry
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
        const { error: insertError } = await supabase
            .from('otp_codes')
            .insert({
                phone: normalizedPhone,
                otp_code: otp,
                expires_at: expiresAt.toISOString(),
            });

        if (insertError) {
            console.error('Insert OTP error:', insertError);
            return NextResponse.json(
                { error: 'Không thể tạo mã OTP. Vui lòng thử lại.' },
                { status: 500 }
            );
        }

        // Send SMS via SpeedSMS
        const smsPayload = {
            to: [normalizedPhone],
            content: `Ma xac thuc XeGhep cua ban la: ${otp}. Ma co hieu luc trong 5 phut.`,
            sms_type: 2, // Brandname SMS
            sender: 'Notify', // Default sender name
        };

        try {
            const smsResponse = await fetch(SPEEDSMS_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${SPEEDSMS_ACCESS_TOKEN}`,
                },
                body: JSON.stringify(smsPayload),
            });

            const smsResult = await smsResponse.json();

            if (!smsResponse.ok || smsResult.status !== 'success') {
                console.error('SpeedSMS error:', smsResult);

                // Development fallback: If SMS fails (e.g., no balance), log OTP to console
                if (process.env.NODE_ENV === 'development') {
                    console.log('='.repeat(50));
                    console.log('📱 DEVELOPMENT MODE - OTP NOT SENT VIA SMS');
                    console.log(`Phone: ${normalizedPhone}`);
                    console.log(`OTP Code: ${otp}`);
                    console.log(`Expires at: ${expiresAt.toLocaleString('vi-VN')}`);
                    console.log('='.repeat(50));

                    return NextResponse.json({
                        success: true,
                        message: '[DEV MODE] Mã OTP đã được tạo. Kiểm tra console server để lấy mã.',
                        devMode: true,
                        otp: otp, // Only in dev mode
                    });
                }

                return NextResponse.json(
                    { error: 'Không thể gửi SMS. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.' },
                    { status: 500 }
                );
            }

            console.log('OTP sent successfully via SMS:', { phone: normalizedPhone });

        } catch (smsError) {
            console.error('SMS sending exception:', smsError);

            // Development fallback
            if (process.env.NODE_ENV === 'development') {
                console.log('='.repeat(50));
                console.log('📱 DEVELOPMENT MODE - SMS FAILED, USING FALLBACK');
                console.log(`Phone: ${normalizedPhone}`);
                console.log(`OTP Code: ${otp}`);
                console.log(`Expires at: ${expiresAt.toLocaleString('vi-VN')}`);
                console.log('='.repeat(50));

                return NextResponse.json({
                    success: true,
                    message: '[DEV MODE] Mã OTP đã được tạo. Kiểm tra console server để lấy mã.',
                    devMode: true,
                    otp: otp,
                });
            }

            return NextResponse.json(
                { error: 'Không thể gửi SMS. Vui lòng thử lại sau.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Mã OTP đã được gửi đến số điện thoại của bạn.',
        });

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}

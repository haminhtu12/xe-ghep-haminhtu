import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOTP } from '@/lib/esms';



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

        // Normalize phone (remove +84, add 0) for database check
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

        // Development Fallback or Missing Config
        // If config is missing, we use Dev Mode to print OTP to console


        // Send SMS via ESMS
        try {
            await sendOTP(normalizedPhone, otp);

            console.log('OTP sent successfully via ESMS:', { phone: normalizedPhone });

            return NextResponse.json({
                success: true,
                message: 'Mã OTP đã được gửi đến số điện thoại của bạn.',
            });

        } catch (smsError: any) {
            console.error('ESMS sending exception:', smsError);

            // Development fallback if ESMS fails
            if (process.env.NODE_ENV === 'development') {
                console.log('='.repeat(50));
                console.log('📱 DEVELOPMENT MODE - ESMS FAILED, USING FALLBACK');
                console.log(`Error: ${smsError.message}`);
                console.log(`Phone: ${normalizedPhone}`);
                console.log(`OTP Code: ${otp}`);
                console.log('='.repeat(50));

                return NextResponse.json({
                    success: true,
                    message: `[DEV MODE] Lỗi gửi ESMS. Mã OTP xem tại console.`,
                    devMode: true,
                    otp: otp,
                });
            }

            return NextResponse.json(
                { error: 'Không thể gửi SMS. Vui lòng kiểm tra lại số điện thoại.' },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('Send OTP error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}

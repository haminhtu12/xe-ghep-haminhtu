import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { phone, otp, newPassword } = await request.json();

        if (!phone || !otp || !newPassword) {
            return NextResponse.json(
                { error: 'Vui lòng nhập đầy đủ thông tin' },
                { status: 400 }
            );
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return NextResponse.json(
                { error: 'Mật khẩu mới phải có ít nhất 6 ký tự' },
                { status: 400 }
            );
        }

        // Normalize phone
        const normalizedPhone = phone.startsWith('+84')
            ? '0' + phone.slice(3)
            : phone;

        // Verify OTP (same logic as verify-otp route)
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

        // Check max attempts
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
        const { data: driver, error: driverError } = await supabase
            .from('drivers')
            .select('id')
            .eq('phone', normalizedPhone)
            .single();

        if (driverError || !driver) {
            return NextResponse.json(
                { error: 'Số điện thoại chưa đăng ký' },
                { status: 404 }
            );
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const { error: updateError } = await supabase
            .from('drivers')
            .update({ password: hashedPassword })
            .eq('phone', normalizedPhone);

        if (updateError) {
            console.error('Update password error:', updateError);
            return NextResponse.json(
                { error: 'Không thể cập nhật mật khẩu. Vui lòng thử lại.' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.',
        });

    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json(
            { error: 'Đã có lỗi xảy ra. Vui lòng thử lại.' },
            { status: 500 }
        );
    }
}

import axios from 'axios';

const ESMS_API_KEY = process.env.ESMS_API_KEY;
const ESMS_SECRET_KEY = process.env.ESMS_SECRET_KEY;
const ESMS_BRANDNAME = process.env.ESMS_BRANDNAME || 'Verify'; // Brandname cho OTP

export async function sendOTP(phone: string, otp: string) {
    try {
        // Format phone: 0912345678 (ESMS chấp nhận format VN)
        const formattedPhone = phone.startsWith('+84')
            ? '0' + phone.slice(3)
            : phone;

        const message = `Ma OTP Xe Ghep: ${otp}. Co hieu luc trong 5 phut.`;

        console.log(`[ESMS] Sending OTP to ${formattedPhone}`);

        // ESMS API endpoint
        const response = await axios.get('http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get', {
            params: {
                ApiKey: ESMS_API_KEY,
                SecretKey: ESMS_SECRET_KEY,
                Phone: formattedPhone,
                Content: message,
                Brandname: ESMS_BRANDNAME,
                SmsType: '2', // 2 = OTP/CSKH (không cần đăng ký brandname)
            }
        });

        console.log('[ESMS] Response:', response.data);

        // Check response
        if (response.data.CodeResult === '100') {
            console.log('[ESMS] SMS sent successfully');
            return {
                success: true,
                messageId: response.data.SMSID
            };
        } else {
            throw new Error(`ESMS Error: ${response.data.ErrorMessage || 'Unknown error'}`);
        }

    } catch (error: any) {
        console.error('[ESMS] Error sending SMS:', error.response?.data || error.message);
        throw new Error('Failed to send OTP via ESMS');
    }
}

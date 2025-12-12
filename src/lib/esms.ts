const ESMS_API_KEY = process.env.ESMS_API_KEY;
const ESMS_SECRET_KEY = process.env.ESMS_SECRET_KEY;
const ESMS_BRANDNAME = process.env.ESMS_BRANDNAME || 'Verify'; // Brandname cho OTP

const ESMS_SMS_TYPE = process.env.ESMS_SMS_TYPE || '2'; // 2=CSKH, 8=QC, 4=Verify

export async function sendOTP(phone: string, otp: string) {
    try {
        // Format phone: 0912345678 (ESMS chấp nhận format VN)
        const formattedPhone = phone.startsWith('+84')
            ? '0' + phone.slice(3)
            : phone;

        const message = `Ma OTP Xe Ghep: ${otp}. Co hieu luc trong 5 phut.`;

        console.log(`[ESMS] Sending OTP to ${formattedPhone}`);
        console.log(`[ESMS] Config: Brandname='${ESMS_BRANDNAME}', SmsType='${ESMS_SMS_TYPE}'`);

        // ESMS API endpoint - SendMultipleMessage_V4_get expects GET with specific params
        const url = new URL('http://rest.esms.vn/MainService.svc/json/SendMultipleMessage_V4_get');
        url.searchParams.append('ApiKey', ESMS_API_KEY || '');
        url.searchParams.append('SecretKey', ESMS_SECRET_KEY || '');
        url.searchParams.append('Phone', formattedPhone);
        url.searchParams.append('Content', message);
        url.searchParams.append('Brandname', ESMS_BRANDNAME);
        url.searchParams.append('SmsType', ESMS_SMS_TYPE);

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        console.log('[ESMS] Response:', data);

        // Check response code from ESMS
        // Check response code from ESMS
        if (data.CodeResult === '100') {
            console.log('[ESMS] SMS sent successfully');
            return {
                success: true,
                messageId: data.SMSID
            };
        } else {
            const errorMsg = `ESMS Error: Code ${data.CodeResult} - ${data.ErrorMessage}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

    } catch (error: any) {
        // Re-throw the original error to preserve details
        console.error('[ESMS] Send failed:', error.message);
        throw error;
    }
}

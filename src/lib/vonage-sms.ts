import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
    apiKey: process.env.VONAGE_API_KEY!,
    apiSecret: process.env.VONAGE_API_SECRET!
});

export async function sendOTP(phone: string, otp: string) {
    try {
        // Chuyển 0912345678 -> 84912345678
        const formattedPhone = phone.startsWith('0')
            ? `84${phone.substring(1)}`
            : phone;

        const from = process.env.VONAGE_FROM_NUMBER || 'Vonage';
        const text = `Ma OTP Xe Ghep: ${otp}. Co hieu luc trong 5 phut.`;

        console.log(`[Vonage] Sending OTP to ${formattedPhone}`);

        const response = await vonage.sms.send({
            to: formattedPhone,
            from: from,
            text: text
        });

        console.log('[Vonage] SMS sent successfully:', response);
        return {
            success: true,
            messageId: response.messages[0]['message-id']
        };
    } catch (error) {
        console.error('[Vonage] Error sending SMS:', error);
        throw new Error('Failed to send OTP via Vonage');
    }
}

import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, serviceType, direction, pickupAddress, dropoffAddress, note, estimatedPrice, seatCount } = body;

        // 1. Validate basic data
        if (!name || !phone || !pickupAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Format the message for "Bắn khách" (Optimized for Copy-Paste to Zalo)
        // Format:
        // CẦN XE [HN-TH]
        // ⏰ Ngay bây giờ
        // ☎️ 09xx.xxx.xxx
        // 📍 Đón: ...
        // 🏁 Trả: ...
        // 💰 ...k - 1 ghế
        // 📝 Note: ...

        const routeText = direction === 'hn-th' ? 'Hà Nội ➝ Thanh Hóa' : 'Thanh Hóa ➝ Hà Nội';
        const priceText = estimatedPrice ? estimatedPrice.toLocaleString('vi-VN') : '0';
        const now = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

        const message = `
🔔 *ĐƠN KHÁCH MỚI* 🔔
--------------------
✈️ *Lộ trình:* ${routeText}
👤 *Khách:* ${name}
☎️ *SĐT:* \`${phone}\` (Chạm để gọi/copy)
📍 *Đón:* ${pickupAddress}
🏁 *Trả:* ${dropoffAddress || 'Trung tâm'}
💰 *Giá:* ${priceText}đ (${seatCount || 1} ghế)
🚘 *Loại xe:* ${serviceType}
📝 *Ghi chú:* ${note || 'Không có'}
⏰ *Thời gian đặt:* ${now}
--------------------
_Copy tin nhắn này gửi vào nhóm Zalo tài xế!_
`.trim();

        console.log('--- NEW BOOKING RECEIVED ---');
        console.log(message);

        // 3. Send to Telegram (if configured)
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            try {
                const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
                await fetch(telegramUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown', // Enable bold/italic
                    }),
                });
            } catch (tgError) {
                console.error('Failed to send Telegram message:', tgError);
                // Don't fail the request if Telegram fails, just log it
            }
        } else {
            console.warn('Telegram credentials not set. Message logged to console only.');
        }

        return NextResponse.json({ success: true, message: 'Booking received' });

    } catch (error) {
        console.error('Booking API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

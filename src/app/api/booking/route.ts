import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, serviceType, direction, pickupAddress, dropoffAddress, note, estimatedPrice, seatCount, seatType } = body;

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

        // Translate Service Type for readability
        let refinedServiceType = serviceType;
        if (serviceType === 'xe-ghep') refinedServiceType = 'Xe Ghép';
        if (serviceType === 'bao-hang-ghe') refinedServiceType = 'Bao Hàng Ghế';
        if (serviceType === 'bao-xe') refinedServiceType = 'Bao Xe Trọn Gói';

        // Translate Seat Type
        let refinedSeatInfo = `${seatCount || 1} ghế`;
        if (seatType === 'ghe-dau') refinedSeatInfo += ' (VIP Đầu)';
        if (seatType === 'ghe-cuoi') refinedSeatInfo += ' (Ghế Cuối)';
        if (seatType === 'ghe-thuong') refinedSeatInfo += ' (Ghế Thường)';

        const message = `
🔔 *ĐƠN KHÁCH MỚI* 🔔
--------------------
✈️ *Lộ trình:* ${routeText}
👤 *Khách:* ${name}
☎️ *SĐT:* \`${phone}\` (Chạm để gọi/copy)
📍 *Đón:* ${pickupAddress}
🏁 *Trả:* ${dropoffAddress || 'Trung tâm'}
💰 *Giá:* ${priceText}đ
💺 *Yêu cầu:* ${refinedSeatInfo}
🚘 *Loại xe:* ${refinedServiceType}
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

        // 4. Save to Database
        const { data: booking, error: dbError } = await supabase
            .from('bookings')
            .insert([
                {
                    name,
                    phone,
                    pickup_address: pickupAddress,
                    dropoff_address: dropoffAddress || null,
                    service_type: serviceType,
                    direction,
                    estimated_price: estimatedPrice,
                    seat_count: seatCount || 1,
                    note: note || null,
                    status: 'pending',
                    seat_type: seatType, // Added seat_type
                    price: estimatedPrice, // Added price (assuming 'price' is the column name for estimatedPrice)
                },
            ])
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            // Don't fail the request if DB fails, just log it
        } else {
            console.log('Booking saved to database:', booking?.id);
        }

        return NextResponse.json({ success: true, message: 'Booking received', bookingId: booking?.id });

    } catch (error) {
        console.error('Booking API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

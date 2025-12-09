import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, carType, licensePlate, routes } = body;

        // 1. Validation
        if (!name || !phone || !carType || !licensePlate) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 2. Save to Database
        const { data: driver, error: dbError } = await supabase
            .from('drivers')
            .insert([
                {
                    name,
                    phone,
                    car_type: carType,
                    license_plate: licensePlate,
                    routes,
                    status: 'pending'
                }
            ])
            .select()
            .single();

        if (dbError) {
            console.error('Database error:', dbError);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        // 3. Send Telegram Notification
        if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
            const message = `
🚗 **ĐĂNG KÝ TÀI XẾ MỚI** 🚗

👤 **Tên:** ${name}
📞 **SĐT:** ${phone}
🚘 **Xe:** ${carType}
🔢 **Biển số:** ${licensePlate}
📍 **Tuyến:** ${routes || 'Chưa rõ'}

_Vào Admin để duyệt tài xế này._
            `;

            try {
                await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        chat_id: TELEGRAM_CHAT_ID,
                        text: message,
                        parse_mode: 'Markdown'
                    }),
                });
            } catch (teleError) {
                console.error('Telegram error:', teleError);
            }
        }

        return NextResponse.json({ success: true, message: 'Registration successful', driverId: driver?.id });

    } catch (error) {
        console.error('Driver API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

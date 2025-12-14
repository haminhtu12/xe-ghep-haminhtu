import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, phone, carType, licensePlate, status } = body;

        // 1. Validation
        if (!name || !phone || !carType) {
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
                    license_plate: licensePlate || '',
                    status: status || 'pending'
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

export async function GET() {
    try {
        const { data: drivers, error } = await supabase
            .from('drivers')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({ drivers });
    } catch (error) {
        console.error('Drivers API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing driver ID' }, { status: 400 });
        }

        // Clean updates object (remove undefined/null values if necessary, though simpler is often better)
        // Ensure we map camelCase from frontend to snake_case for DB if needed, 
        // but here the existing code uses `status` directly.
        // The DB columns we know are: name, phone, car_type, license_plate, status.
        // Let's map them explicitly to be safe.

        const dbUpdates: any = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.phone) dbUpdates.phone = updates.phone;
        if (updates.carType) dbUpdates.car_type = updates.carType;
        if (updates.licensePlate) dbUpdates.license_plate = updates.licensePlate;
        if (updates.status) dbUpdates.status = updates.status;

        const { error } = await supabase
            .from('drivers')
            .update(dbUpdates)
            .eq('id', id);

        if (error) {
            console.error('Database error:', error);
            return NextResponse.json({ error: 'Database error' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Update driver API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing driver ID' }, { status: 400 });
        }

        // 1. Delete related transactions first
        const { error: transError } = await supabase
            .from('driver_transactions')
            .delete()
            .eq('driver_id', id);

        if (transError && transError.code !== '42P01') { // Ignore if table doesn't exist
            console.error('Error deleting transactions:', transError);
        }

        // 2. Delete related bookings
        const { error: bookingError } = await supabase
            .from('bookings')
            .delete()
            .eq('driver_id', id);

        if (bookingError) {
            console.error('Error deleting bookings:', bookingError);
        }

        // 3. Delete driver
        const { error } = await supabase
            .from('drivers')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Database error:', error);
            // Translate common FK error for easier debugging
            if (error.message?.includes('foreign key constraint')) {
                return NextResponse.json({
                    error: 'Không thể xóa: Tài xế này còn dữ liệu liên quan (giao dịch, chuyến đi) và hệ thống không thể tự động xóa.',
                    details: error
                }, { status: 500 });
            }
            return NextResponse.json({ error: error.message || 'Database error', details: error }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Delete driver API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

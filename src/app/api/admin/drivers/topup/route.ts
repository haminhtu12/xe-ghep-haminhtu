import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { driverId, amount, note } = await request.json();

        if (!driverId || !amount) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Get current balance
        const { data: driver, error: driverError } = await supabase
            .from('drivers')
            .select('wallet_balance')
            .eq('id', driverId)
            .single();

        if (driverError || !driver) {
            return NextResponse.json({ error: 'Driver not found' }, { status: 404 });
        }

        const newBalance = (driver.wallet_balance || 0) + parseInt(amount);

        // 2. Update wallet balance
        const { error: updateError } = await supabase
            .from('drivers')
            .update({ wallet_balance: newBalance })
            .eq('id', driverId);

        if (updateError) {
            throw updateError;
        }

        // 3. Log transaction (Optional but recommended)
        // For now we just update the balance. In a real app we'd insert into a transactions table.

        return NextResponse.json({
            success: true,
            new_balance: newBalance,
            message: `Đã nạp ${parseInt(amount).toLocaleString('vi-VN')}đ cho tài xế.`
        });

    } catch (error) {
        console.error('Top up error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete('driver_token');

        // Redirect to driver login page
        return NextResponse.redirect(new URL('/tai-xe/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
    } catch (error) {
        console.error('Driver logout error:', error);
        return NextResponse.redirect(new URL('/tai-xe/login', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
    }
}

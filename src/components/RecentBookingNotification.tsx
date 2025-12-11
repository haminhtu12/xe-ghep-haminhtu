'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, MapPin, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { FIRST_NAMES, LAST_NAMES, MIDDLE_NAMES, LOCATIONS } from '@/data/mockDrivers';

// Helper to get random item
const getRandom = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

export default function RecentBookingNotification() {
    const pathname = usePathname();
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<{ name: string; from: string; to: string; time: string } | null>(null);

    useEffect(() => {
        // Initial delay before first notification
        const initialTimer = setTimeout(() => {
            showNotification();
        }, 5000);

        // Interval to show notifications periodically
        const interval = setInterval(() => {
            showNotification();
        }, 30000 + Math.random() * 20000); // Every 30-50 seconds

        return () => {
            clearTimeout(initialTimer);
            clearInterval(interval);
        };
    }, []);

    const showNotification = () => {
        // Generate mock data for the notification
        const lastName = getRandom(LAST_NAMES);
        const middleName = getRandom(MIDDLE_NAMES); // Optional, maybe too long
        const firstName = getRandom(FIRST_NAMES);

        // Sometimes use full name, sometimes just Last + First
        const name = Math.random() > 0.5
            ? `${lastName} ${firstName}`
            : `${lastName} ${middleName} ${firstName}`;

        const isToHanoi = Math.random() > 0.5;
        const from = isToHanoi ? 'Thanh Hóa' : 'Hà Nội';
        const to = isToHanoi ? 'Hà Nội' : 'Thanh Hóa';

        const times = ['vừa xong', '1 phút trước', '2 phút trước', 'vừa đặt'];
        const time = getRandom(times);

        setData({ name, from, to, time });
        setVisible(true);

        // Hide after 5 seconds
        setTimeout(() => {
            setVisible(false);
        }, 5000);
    };

    if (!visible || !data || pathname?.startsWith('/tai-xe')) return null;

    return (
        <div className="fixed bottom-24 right-6 md:bottom-6 md:left-6 md:right-auto z-40 max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-white rounded-xl shadow-2xl shadow-slate-200 border border-slate-100 p-4 flex items-start gap-4 relative overflow-hidden">

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 h-1 bg-green-500 animate-[width_6s_linear_forwards] w-full origin-left"></div>

                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                    <ShieldCheck className="w-6 h-6" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
                        Đơn hàng mới
                        <span className="text-green-500 ml-1">• {data.time}</span>
                    </p>
                    <p className="text-sm text-slate-800 font-medium">
                        <span className="font-bold">{data.name}</span> vừa đặt xe ghép
                    </p>
                    <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
                        <MapPin className="w-3 h-3 text-amber-500" />
                        {data.from} ➝ {data.to}
                    </div>
                </div>

                <button
                    onClick={() => setVisible(false)}
                    className="text-slate-300 hover:text-slate-500 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}

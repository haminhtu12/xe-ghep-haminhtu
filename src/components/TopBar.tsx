'use client';

import { Phone, Clock, MapPin } from 'lucide-react';

export default function TopBar() {
    return (
        <div className="bg-slate-900 text-white py-2 px-4 text-xs md:text-sm border-b border-slate-800 hidden md:block z-[101] relative">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-300">
                        <MapPin className="w-4 h-4 text-amber-500" />
                        <span>Chuyên tuyến Hà Nội ⇄ Thanh Hóa</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Phục vụ 24/7 xuyên Lễ Tết</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <a href="tel:0334909668" className="flex items-center gap-2 font-bold hover:text-amber-400 transition-colors">
                        <Phone className="w-4 h-4 text-amber-500 animate-pulse" />
                        Tổng đài: <span className="text-amber-400 text-base">0334.909.668</span>
                    </a>
                </div>
            </div>
        </div>
    );
}

'use client';
import { Phone, Car } from 'lucide-react';

export default function ContactButtons() {
    return (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end animate-in fade-in duration-300">
            {/* Book Now Button */}
            <button
                onClick={() => {
                    const bookingForm = document.getElementById('booking-form');
                    if (bookingForm) {
                        bookingForm.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        window.location.href = '/#booking-form';
                    }
                }}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg shadow-amber-500/40 hover:shadow-xl hover:shadow-amber-500/50 hover:-translate-y-1 transition-all animate-bounce-slow origin-right scale-95 hover:scale-100 opacity-90 hover:opacity-100"
            >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                    <Car className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase font-bold text-amber-100 mb-0.5">Đặt xe ngay</span>
                    <span className="font-bold text-sm">Hà Nội ⇄ Thanh Hóa</span>
                </div>
            </button>

            {/* Zalo Button */}
            <a
                href="https://zalo.me/0334909668"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all group scale-95 hover:scale-100 origin-right opacity-90 hover:opacity-100"
            >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-bold text-lg">Z</span>
                </div>
                <div className="flex flex-col items-start leading-none relative">
                    <span className="text-[10px] uppercase font-bold text-blue-100 mb-0.5">Chat Zalo</span>
                    <span className="font-bold text-sm">033.490.9668</span>

                    {/* Notification Dot */}
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                </div>
            </a>

            {/* Phone Button */}
            <a
                href="tel:0334909668"
                className="flex items-center gap-2 bg-red-500 text-white pl-3 pr-4 py-2.5 rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 transition-all scale-95 hover:scale-100 origin-right opacity-90 hover:opacity-100"
            >
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                    <Phone className="w-4 h-4 fill-current" />
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase font-bold text-red-100 mb-0.5">Hotline 24/7</span>
                    <span className="font-bold text-sm">033.490.9668</span>
                </div>
            </a>
        </div>
    );
}

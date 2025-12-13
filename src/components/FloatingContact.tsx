'use client';

import { Phone, MessageCircle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FloatingContact() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling down a bit (e.g., 200px)
            setIsVisible(window.scrollY > 200);
        };

        window.addEventListener('scroll', handleScroll);
        // Initial check
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToBooking = () => {
        document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={`fixed bottom-6 right-4 sm:right-6 flex flex-col gap-3 z-[9999] transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>

            {/* Zalo Button */}
            <a
                href="https://zalo.me/0334909668"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-600/30 hover:scale-110 active:scale-95 transition-all relative group"
                aria-label="Chat Zalo"
            >
                <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
                <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                <span className="absolute right-full mr-3 bg-white text-slate-800 text-xs font-bold px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Chat Zalo
                </span>
            </a>

            {/* Phone Button */}
            <a
                href="tel:0334909668"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-600/30 hover:scale-110 active:scale-95 transition-all relative group animate-bounce-slow"
                aria-label="Gọi ngay"
            >
                <div className="absolute inset-0 bg-red-600 rounded-full animate-ping opacity-20"></div>
                <Phone className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
                <span className="absolute right-full mr-3 bg-white text-slate-800 text-xs font-bold px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    Gọi ngay
                </span>
            </a>

            {/* Quick Book Button (Mobile Only Text) */}
            <button
                onClick={scrollToBooking}
                className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all relative group md:hidden"
                aria-label="Đặt xe"
            >
                <Zap className="w-6 h-6 sm:w-7 sm:h-7 fill-white" />
            </button>
        </div>
    );
}

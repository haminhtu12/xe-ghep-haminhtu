'use client';

import { Phone, MessageCircle } from 'lucide-react';

export default function ContactButtons() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
            {/* Zalo Button */}
            <a
                href="https://zalo.me/0912345678" // Replace with actual number
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:-translate-y-1 transition-all group"
            >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-bold text-lg">Z</span>
                </div>
                <div className="flex flex-col items-start leading-none relative">
                    <span className="text-[10px] uppercase font-bold text-blue-100 mb-0.5">Chat Zalo</span>
                    <span className="font-bold">0912.345.678</span>

                    {/* Tooltip-like badge */}
                    <span className="absolute -top-1 -right-2 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                    <span className="absolute -top-1 -right-2 w-3 h-3 bg-red-500 rounded-full border border-white"></span>
                </div>
            </a>

            {/* Phone Button */}
            <a
                href="tel:0987654321" // Replace with actual number
                className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-600 text-white pl-4 pr-5 py-3 rounded-full shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-1 transition-all animate-bounce-slow"
            >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                    <Phone className="w-5 h-5 fill-current" />
                </div>
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] uppercase font-bold text-red-100 mb-0.5">Hotline 24/7</span>
                    <span className="font-bold text-lg">0987.654.321</span>
                </div>
            </a>
        </div>
    );
}

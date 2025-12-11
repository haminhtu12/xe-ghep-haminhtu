'use client';
import { Phone, Car } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ContactButtons() {
    const pathname = usePathname();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleFocus = (e: FocusEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
                setIsVisible(false);
            }
        };

        const handleBlur = () => {
            setIsVisible(true);
        };

        window.addEventListener('focus', handleFocus, true);
        window.addEventListener('blur', handleBlur, true);

        return () => {
            window.removeEventListener('focus', handleFocus, true);
            window.removeEventListener('blur', handleBlur, true);
        };
    }, []);

    const [isExpanded, setIsExpanded] = useState(false);

    // Hide contact buttons completely on driver pages to avoid cluttering the dashboard
    if (pathname?.startsWith('/tai-xe')) {
        return null;
    }

    if (!isVisible) return null;

    return (
        <div className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-40 flex flex-col items-end animate-in fade-in duration-300`}>
            {/* Expanded Menu */}
            {isExpanded && (
                <div className="flex flex-col gap-3 mb-3 animate-in slide-in-from-bottom-5 duration-200">
                    {/* Zalo Button */}
                    <a
                        href="https://zalo.me/0334909668"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 bg-blue-600 text-white pl-4 pr-4 py-2.5 rounded-full shadow-lg hover:bg-blue-700 transition-all origin-right"
                    >
                        <span className="font-bold text-sm">Chat Zalo</span>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-lg">Z</div>
                    </a>

                    {/* Hotline Button */}
                    <a
                        href="tel:0334909668"
                        className="flex items-center gap-3 bg-red-500 text-white pl-4 pr-4 py-2.5 rounded-full shadow-lg hover:bg-red-600 transition-all origin-right"
                    >
                        <span className="font-bold text-sm">Gọi Hotline</span>
                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <Phone className="w-4 h-4 fill-current" />
                        </div>
                    </a>
                </div>
            )}

            {/* Main FAB Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`flex items-center justify-center w-14 h-14 rounded-full shadow-xl transition-all duration-300 ${isExpanded ? 'bg-slate-800 rotate-90' : 'bg-gradient-to-r from-amber-500 to-orange-600 animate-bounce-slow'}`}
            >
                {isExpanded ? (
                    <span className="text-white text-2xl font-bold">×</span>
                ) : (
                    <Phone className="w-6 h-6 text-white fill-current animate-pulse" />
                )}

                {/* Notification Dot */}
                {!isExpanded && (
                    <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white rounded-full"></span>
                )}
            </button>
        </div>
    );
}

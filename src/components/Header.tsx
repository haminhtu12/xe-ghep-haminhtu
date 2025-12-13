'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Menu, X, Phone, LayoutDashboard, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isDriver, setIsDriver] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check driver login status
    useEffect(() => {
        const checkDriver = async () => {
            try {
                const res = await fetch('/api/drivers/me');
                if (res.ok) {
                    setIsDriver(true);
                }
            } catch (error) {
                console.error('Auth check failed', error);
            }
        };
        checkDriver();
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    // Hide header on driver dashboard as it has its own header
    if (pathname?.startsWith('/tai-xe/dashboard')) {
        return null;
    }

    return (
        <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled || pathname !== '/' ? 'bg-white shadow-md py-2' : 'bg-transparent py-3'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-7 h-7 md:w-9 md:h-9 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                            <Car className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        </div>
                        <span className={`text-lg md:text-2xl font-bold ${scrolled || pathname !== '/' ? 'text-slate-800' : 'text-white'}`}>
                            Xe<span className="text-amber-500">Ghép PRO</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                        <Link
                            href="/"
                            className={`font-bold transition-colors ${scrolled || pathname !== '/' ? 'text-slate-600 hover:text-amber-600' : 'text-white hover:text-amber-200 drop-shadow-md'}`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            href="/ve-chung-toi"
                            className={`font-bold transition-colors ${scrolled || pathname !== '/' ? 'text-slate-600 hover:text-amber-600' : 'text-white hover:text-amber-200 drop-shadow-md'}`}
                        >
                            Về chúng tôi
                        </Link>

                        {/* Book Now Button (Desktop) */}
                        {pathname === '/' && (
                            <button
                                onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                                className={`font-bold px-6 py-3 rounded-full transition-all border shadow-lg ${scrolled
                                    ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                                    : 'bg-white text-slate-900 border-white hover:bg-slate-100'
                                    }`}
                            >
                                Đặt xe
                            </button>
                        )}

                        {/* Driver CTA Button */}
                        {isDriver ? (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/tai-xe/dashboard"
                                    className="pl-6 pr-8 py-3 rounded-full font-bold bg-amber-500 text-white shadow-lg hover:bg-amber-600 transition-all transform hover:scale-105 flex items-center gap-2 border border-amber-400"
                                >
                                    <LayoutDashboard className="w-5 h-5" />
                                    Trang Tài Xế
                                </Link>
                                <a
                                    href="/api/drivers/logout"
                                    className="pl-4 pr-6 py-3 rounded-full font-bold bg-red-500 text-white shadow-lg hover:bg-red-600 transition-all transform hover:scale-105 flex items-center gap-2"
                                    title="Đăng xuất"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Đăng xuất
                                </a>
                            </div>
                        ) : (
                            <Link
                                href="/tai-xe"
                                className={`px-6 py-3 rounded-full font-bold transition-all transform hover:scale-105 border ${pathname === '/tai-xe'
                                    ? 'bg-amber-100 text-amber-700 border-amber-200'
                                    : 'bg-white text-slate-900 border-white shadow-lg hover:shadow-amber-500/20'
                                    }`}
                            >
                                Đăng ký Tài xế
                            </Link>
                        )}
                    </nav>

                    {/* Mobile Menu Removed */}
                </div>
            </div>
        </header>
    );
}

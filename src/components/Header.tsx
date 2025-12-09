'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, Menu, X, Phone } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                            <Car className="w-6 h-6 text-white" />
                        </div>
                        <span className={`text-2xl font-bold ${scrolled || pathname !== '/' ? 'text-slate-800' : 'text-white'}`}>
                            Xe<span className="text-amber-500">Ghép</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="/"
                            className={`font-medium hover:text-amber-500 transition-colors ${scrolled || pathname !== '/' ? 'text-slate-600' : 'text-slate-200'}`}
                        >
                            Trang chủ
                        </Link>
                        <Link
                            href="/ve-chung-toi"
                            className={`font-medium hover:text-amber-500 transition-colors ${scrolled || pathname !== '/' ? 'text-slate-600' : 'text-slate-200'}`}
                        >
                            Về chúng tôi
                        </Link>

                        {/* Driver CTA Button */}
                        <Link
                            href="/tai-xe"
                            className={`px-5 py-2.5 rounded-full font-bold transition-all transform hover:scale-105 ${pathname === '/tai-xe'
                                ? 'bg-amber-100 text-amber-700 border border-amber-200'
                                : 'bg-white text-slate-900 shadow-lg hover:shadow-amber-500/20'
                                }`}
                        >
                            Đăng ký Tài xế
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2 rounded-lg ${scrolled || pathname !== '/' ? 'text-slate-800' : 'text-white'}`}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-xl p-4 animate-in slide-in-from-top-2">
                    <nav className="flex flex-col gap-4">
                        <Link href="/" className="px-4 py-3 rounded-xl hover:bg-slate-50 font-medium text-slate-700">
                            Trang chủ
                        </Link>
                        <Link href="/tai-xe" className="px-4 py-3 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-between">
                            Đăng ký Tài xế
                            <Car className="w-5 h-5" />
                        </Link>
                        <div className="border-t border-slate-100 pt-4 mt-2">
                            <a href="tel:0912345678" className="px-4 py-3 rounded-xl bg-green-50 text-green-700 font-bold flex items-center gap-3 justify-center">
                                <Phone className="w-5 h-5" />
                                Hotline: 0912.345.678
                            </a>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}

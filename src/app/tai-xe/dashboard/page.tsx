'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, MapPin, Bell, LogOut, ChevronRight, History, PlusCircle, Gift } from 'lucide-react';

export default function DriverDashboard() {
    const [driver, setDriver] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<'hanoi' | 'thanhhoa'>('hanoi');
    const router = useRouter();

    useEffect(() => {
        fetchDriver();
    }, []);

    const fetchDriver = async () => {
        try {
            const res = await fetch('/api/drivers/me');
            if (res.ok) {
                const data = await res.json();
                setDriver(data.driver);
                setLocation(data.driver.current_location === 'thanhhoa' ? 'thanhhoa' : 'hanoi');
            } else {
                router.push('/tai-xe/login');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleLocation = async () => {
        const newLoc = location === 'hanoi' ? 'thanhhoa' : 'hanoi';
        setLocation(newLoc);
        // TODO: Update to server
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Đang tải...</div>;

    if (!driver) return null;

    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm">Xin chào,</p>
                        <h1 className="text-2xl font-bold">{driver.name}</h1>
                        <p className="text-sm text-slate-400 mt-1">{driver.phone}</p>
                    </div>
                    <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors relative">
                        <Bell className="w-6 h-6 text-white" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
                    </button>
                </div>

                {/* Wallet Card */}
                <div className="mt-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 shadow-lg shadow-amber-500/20 text-white">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-amber-100 text-sm font-medium flex items-center gap-2">
                            <Wallet className="w-4 h-4" /> Số dư ví
                        </span>
                        <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
                            Đã xác thực
                        </span>
                    </div>
                    <div className="text-3xl font-bold">
                        {driver.wallet_balance.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="mt-4 flex gap-2">
                        <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">
                            Nạp tiền
                        </button>
                        <button className="flex-1 bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-bold backdrop-blur-sm transition-colors">
                            Rút tiền
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-4 relative z-10 space-y-4">

                {/* Location Toggle */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Vị trí hiện tại của bạn
                    </p>
                    <div className="flex bg-slate-100 p-1 rounded-xl relative">
                        <div
                            className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ${location === 'hanoi' ? 'left-1' : 'left-[calc(50%+4px)]'}`}
                        ></div>
                        <button
                            onClick={() => setLocation('hanoi')}
                            className={`flex-1 py-3 text-center font-bold text-sm relative z-10 transition-colors ${location === 'hanoi' ? 'text-slate-900' : 'text-slate-400'}`}
                        >
                            Hà Nội
                        </button>
                        <button
                            onClick={() => setLocation('thanhhoa')}
                            className={`flex-1 py-3 text-center font-bold text-sm relative z-10 transition-colors ${location === 'thanhhoa' ? 'text-slate-900' : 'text-slate-400'}`}
                        >
                            Thanh Hóa
                        </button>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-2 gap-4">
                    <button className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-amber-500 transition-colors group">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlusCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="font-bold text-slate-800">Tìm Khách</span>
                    </button>
                    <button className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-amber-500 transition-colors group">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <History className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-800">Lịch Sử</span>
                    </button>
                </div>

                {/* Recent Activity (Placeholder) */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-slate-800">Giao dịch gần đây</h3>
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                    <Gift className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Thưởng thành viên mới</p>
                                    <p className="text-xs text-slate-500">Hệ thống tặng</p>
                                </div>
                            </div>
                            <span className="font-bold text-green-600">+500.000đ</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => router.push('/api/auth/logout')}
                    className="w-full py-4 text-slate-400 font-medium flex items-center justify-center gap-2 hover:text-red-500 transition-colors"
                >
                    <LogOut className="w-5 h-5" /> Đăng xuất
                </button>
            </div>
        </div>
    );
}

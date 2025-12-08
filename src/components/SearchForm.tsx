'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, Search, ArrowRight, ArrowLeftRight, Package, Car, Users, Clock } from 'lucide-react';
import BookingModal from './BookingModal';

const SERVICE_TYPES = [
    { id: 'xe-ghep', name: 'Xe Tiện Chuyến', icon: Users, price: 400000, desc: 'Đi chung, tiết kiệm' },
    { id: 'bao-xe', name: 'Bao Xe Trọn Gói', icon: Car, price: 1100000, desc: 'Riêng tư, đưa đón tận nơi' },
    { id: 'gui-do', name: 'Gửi Hàng Hỏa Tốc', icon: Package, price: 100000, desc: 'Nhận hàng trong ngày' },
];

export default function SearchForm() {
    const [serviceType, setServiceType] = useState('xe-ghep');
    const [direction, setDirection] = useState<'hn-th' | 'th-hn'>('hn-th');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [seatCount, setSeatCount] = useState(1);
    const [estimatedPrice, setEstimatedPrice] = useState<number>(400000);

    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    // Auto-update price when service changes
    useEffect(() => {
        const service = SERVICE_TYPES.find(s => s.id === serviceType);
        if (service) {
            // Only xe-ghep and bao-xe might care about seats, but usually bao-xe is fixed price or per car.
            // Requirement says "giá xe tiện chuyên 400k/1 ghế".
            // Let's assume seat count multiplier applies primarily to 'xe-ghep'.
            // For 'bao-xe', it's usually one price for the whole car, but let's keep it simple or strictly for xe-ghep.
            // If service is 'xe-ghep', multiply by seatCount. Else (e.g. gui-do, bao-xe), usually fixed or different logic.
            // However, user specifically asked for "cho phép chọn số ghế đi" in context of "giá xe tiện chuyên 400k/1 ghế".
            // So if type is 'xe-ghep', we use seatCount.

            if (service.id === 'xe-ghep') {
                setEstimatedPrice(service.price * seatCount);
            } else {
                setEstimatedPrice(service.price);
            }
        }
    }, [serviceType, seatCount]);

    const toggleDirection = () => {
        setDirection(prev => prev === 'hn-th' ? 'th-hn' : 'hn-th');
    };

    return (
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-6 lg:p-10 max-w-5xl mx-auto relative z-10 border border-slate-100">
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
                bookingData={{
                    serviceType,
                    direction,
                    estimatedPrice,
                    seatCount // Pass seat count
                }}
            />

            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-5 bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-amber-500/30 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Chạy liên tục 24/7
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-8 mt-2">

                {/* Service Type Selection - Big Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SERVICE_TYPES.map((service) => {
                        const isActive = serviceType === service.id;
                        const Icon = service.icon;
                        return (
                            <button
                                key={service.id}
                                type="button"
                                onClick={() => setServiceType(service.id)}
                                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${isActive
                                    ? 'bg-amber-50 border-amber-500 shadow-md transform scale-[1.02]'
                                    : 'bg-white border-slate-100 hover:border-amber-200 hover:bg-slate-50'
                                    }`}
                            >
                                <div className={`p-3 rounded-full mb-3 ${isActive ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                                <span className={`font-bold text-lg ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{service.name}</span>
                                <span className={`text-xs ${isActive ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>{service.desc}</span>

                                {isActive && (
                                    <div className="absolute top-2 right-2 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Route Selection - Simplified & Focused */}
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 relative">

                    <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">

                        {/* FROM */}
                        <div className="flex-1 w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase block">Điểm đi</label>
                                <p className="text-xl font-bold text-slate-800">
                                    {direction === 'hn-th' ? 'Hà Nội' : 'Thanh Hóa'}
                                </p>
                            </div>
                        </div>

                        {/* SWAP BUTTON */}
                        <button
                            type="button"
                            onClick={toggleDirection}
                            className="w-12 h-12 bg-white rounded-full border border-slate-200 shadow-md flex items-center justify-center text-amber-500 hover:scale-110 hover:shadow-lg hover:border-amber-400 transition-all rotate-90 md:rotate-0"
                        >
                            <ArrowLeftRight className="w-5 h-5" />
                        </button>

                        {/* TO */}
                        <div className="flex-1 w-full bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase block">Điểm đến</label>
                                <p className="text-xl font-bold text-slate-800">
                                    {direction === 'hn-th' ? 'Thanh Hóa' : 'Hà Nội'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-slate-200 border-t border-dashed border-slate-300 -z-0"></div>
                </div>

                {/* Footer: Date & Price & Action */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                    {/* Date Picker */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center gap-4 cursor-pointer hover:border-amber-300 transition-colors">
                        <Calendar className="w-6 h-6 text-slate-400" />
                        <div className="flex-1">
                            <label className="text-xs font-bold text-slate-400 uppercase block">Ngày đi</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-transparent w-full text-lg font-bold text-slate-800 outline-none cursor-pointer"
                            />
                        </div>
                    </div>

                    {/* Seat Selection (Only for Xe Ghep) */}
                    {serviceType === 'xe-ghep' && (
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Users className="w-6 h-6 text-slate-400" />
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase block">Số ghế</label>
                                    <span className="text-lg font-bold text-slate-800">{seatCount} Hành khách</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-amber-100 hover:text-amber-600 transition-colors"
                                >
                                    -
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSeatCount(Math.min(7, seatCount + 1))}
                                    className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-amber-100 hover:text-amber-600 transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Price & Submit */}
                    {/* Price & Submit - Optimized for CTA */}
                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <div className="w-full md:w-auto text-right pr-4 hidden md:block">
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Giá trọn gói</p>
                            <p className="text-3xl font-extrabold text-emerald-600">
                                <span className="text-sm font-semibold text-slate-400 mr-1">
                                    {serviceType === 'xe-ghep' ? '' : 'Từ '}
                                </span>
                                {estimatedPrice.toLocaleString('vi-VN')} <span className="text-sm align-top text-emerald-500">đ</span>
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setIsBookingModalOpen(true)}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 animate-pulse"
                        >
                            <span>ĐẶT XE NGAY</span>
                            <ArrowRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Live Driver Feed - Social Proof (Fake Supply Strategy) */}
                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Tài xế đang chờ khách
                        </h4>
                        <span className="text-xs text-amber-600 font-semibold cursor-pointer hover:underline">Xem tất cả ›</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { name: 'Nguyễn Văn Nam', car: 'Toyota Vios 2022', rating: 4.9, loc: 'Ngã Tư Sở, Hà Nội' },
                            { name: 'Trần Tùng', car: 'Hyundai Accent 2023', rating: 5.0, loc: 'BigC Thanh Hóa' },
                            { name: 'Phạm Hùng', car: 'Kia Cerato', rating: 4.8, loc: 'Giáp Bát, Hà Nội' },
                            { name: 'Lê Tuấn', car: 'Xpander 7 chỗ', rating: 4.9, loc: 'Sầm Sơn, Thanh Hóa' },
                        ].map((driver, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-amber-200 transition-colors cursor-pointer group">
                                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs border-2 border-white shadow-sm">
                                    {driver.name.split(' ').pop()?.[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-bold text-slate-800 truncate group-hover:text-amber-600 transition-colors">{driver.name}</p>
                                        <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                                            ⭐ {driver.rating}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                                        <Car className="w-3 h-3" /> {driver.car} • 📍 {driver.loc}
                                    </p>
                                </div>
                                <button className="text-xs font-bold text-white bg-slate-900 px-3 py-1.5 rounded-lg group-hover:bg-amber-500 transition-colors">
                                    Chọn
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

            </form>
        </div>
    );
}

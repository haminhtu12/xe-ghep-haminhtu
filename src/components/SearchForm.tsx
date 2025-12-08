'use client';

import { useState } from 'react';
import { MapPin, Calendar, Search, ArrowRight, ArrowLeftRight, Package, Car, Users } from 'lucide-react';

// Danh sách 63 tỉnh thành Việt Nam
const CITIES = [
    'Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Hải Dương', 'Hưng Yên', 'Bắc Ninh',
    'Vĩnh Phúc', 'Thái Nguyên', 'Phú Thọ', 'Bắc Giang', 'Lạng Sơn', 'Cao Bằng',
    'Hà Giang', 'Tuyên Quang', 'Yên Bái', 'Lào Cai', 'Điện Biên', 'Lai Châu',
    'Sơn La', 'Hòa Bình', 'Ninh Bình', 'Nam Định', 'Thái Bình', 'Hà Nam',
    'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế',
    'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa',
    'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng',
    'TP. Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Tây Ninh',
    'Bình Phước', 'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long',
    'Đồng Tháp', 'An Giang', 'Kiên Giang', 'Cần Thơ', 'Hậu Giang', 'Sóc Trăng',
    'Bạc Liêu', 'Cà Mau',
    'Sân bay Nội Bài', 'Sân bay Tân Sơn Nhất'
].sort();

// Các loại dịch vụ - Thiết kế mới
const SERVICE_TYPES = [
    { id: 'xe-ghep', name: 'Xe Tiện Chuyến', icon: Users },
    { id: 'bao-xe', name: 'Bao Xe Trọn Gói', icon: Car },
    { id: 'gui-do', name: 'Gửi Hàng Hóa', icon: Package },
];

const POPULAR_ROUTES = [
    { from: 'Hà Nội', to: 'Ninh Bình', price: 180000 },
    { from: 'Hà Nội', to: 'Hải Phòng', price: 150000 },
    { from: 'Hà Nội', to: 'Quảng Ninh', price: 200000 },
    { from: 'Hà Nội', to: 'Thanh Hóa', price: 200000 },
    { from: 'Nội Bài', to: 'Hà Nội', price: 200000 },
];

export default function SearchForm() {
    const [serviceType, setServiceType] = useState('xe-ghep');
    const [from, setFrom] = useState('Hà Nội');
    const [to, setTo] = useState('Ninh Bình');
    const [date, setDate] = useState('');
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

    const calculatePrice = () => {
        const route = POPULAR_ROUTES.find(r => r.from === from && r.to === to);
        let basePrice = route ? route.price : Math.floor(Math.random() * 100 + 50) * 1500;

        if (serviceType === 'bao-xe') basePrice *= 3;
        if (serviceType === 'gui-do') basePrice = Math.floor(basePrice * 0.4);

        setEstimatedPrice(basePrice);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        calculatePrice();
    };

    const swapLocations = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    return (
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 lg:p-10 max-w-6xl mx-auto relative z-10 border border-slate-100">
            <form onSubmit={handleSearch} className="space-y-8">

                {/* Header Form: Title & Service Type */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <span className="bg-amber-500 w-2 h-8 rounded-full"></span>
                            Bạn muốn đi đâu?
                        </h3>
                        <p className="text-slate-500 text-sm mt-1 pl-4">Khám phá hàng nghìn chuyến xe giá rẻ mỗi ngày</p>
                    </div>

                    {/* Service Selector - Spacious Pill Design */}
                    <div className="flex flex-wrap gap-2 bg-slate-50 p-2 rounded-2xl self-start lg:self-auto border border-slate-100">
                        {SERVICE_TYPES.map((service) => {
                            const isActive = serviceType === service.id;
                            const Icon = service.icon;
                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => setServiceType(service.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${isActive
                                        ? 'bg-white text-amber-600 shadow-md ring-1 ring-slate-200 transform scale-105'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
                                    {service.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Input Fields Container - Spacious Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_auto_1.5fr_1.2fr] gap-4 lg:gap-6 items-center">

                    {/* FROM */}
                    <div className="relative group bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer h-24 flex flex-col justify-center">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                            Điểm đi
                        </label>
                        <div className="flex items-center">
                            <MapPin className="w-6 h-6 text-amber-500 mr-3 group-hover:-translate-y-1 transition-transform" />
                            <select
                                value={from}
                                onChange={(e) => setFrom(e.target.value)}
                                className="w-full bg-transparent font-bold text-xl text-slate-800 outline-none appearance-none cursor-pointer truncate"
                            >
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* SWAP BUTTON - Centered and Larger */}
                    <div className="flex justify-center -my-6 lg:my-0 relative z-20">
                        <button
                            type="button"
                            onClick={swapLocations}
                            className="p-4 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-amber-600 hover:border-amber-400 hover:shadow-lg transition-all active:rotate-180 transform hover:scale-110"
                        >
                            <ArrowLeftRight className="w-5 h-5" />
                        </button>
                    </div>

                    {/* TO */}
                    <div className="relative group bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer h-24 flex flex-col justify-center">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                            Điểm đến
                        </label>
                        <div className="flex items-center">
                            <MapPin className="w-6 h-6 text-orange-500 mr-3 group-hover:-translate-y-1 transition-transform" />
                            <select
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full bg-transparent font-bold text-xl text-slate-800 outline-none appearance-none cursor-pointer truncate"
                            >
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* DATE & SEARCH - Combined Column for Mobile, Separate for Desktop */}
                    <div className="flex flex-col gap-4">
                        {/* DATE */}
                        <div className="relative group bg-slate-50 hover:bg-white p-4 rounded-2xl border border-slate-200 hover:border-amber-400 transition-all cursor-pointer h-24 flex flex-col justify-center">
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-1">
                                Ngày đi
                            </label>
                            <div className="flex items-center">
                                <Calendar className="w-6 h-6 text-slate-400 mr-3 group-hover:text-amber-500 transition-colors" />
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-transparent font-bold text-xl text-slate-800 outline-none w-full cursor-pointer h-full"
                                />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Action & Price Footer */}
                <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-4 border-t border-slate-100">
                    {/* Price Display */}
                    <div className="flex-1 w-full lg:w-auto bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100/50">
                        {estimatedPrice ? (
                            <div className="flex items-center gap-4 animate-fade-in">
                                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                                    <span className="text-2xl">⚡</span>
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Giá ước tính ({SERVICE_TYPES.find(s => s.id === serviceType)?.name})</p>
                                    <p className="text-2xl font-extrabold text-emerald-700">
                                        {estimatedPrice.toLocaleString('vi-VN')} <span className="text-sm font-medium text-emerald-600">VNĐ</span>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 opacity-60">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">?</div>
                                <p className="text-slate-400 text-sm italic">
                                    Vui lòng chọn lộ trình để xem giá
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Search Button - Big & Bold */}
                    <button
                        type="submit"
                        className="w-full lg:w-auto bg-gradient-to-r from-amber-500 to-orange-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:from-amber-600 hover:to-orange-700 shadow-xl shadow-amber-200 hover:shadow-2xl hover:shadow-amber-400/30 transform hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group"
                    >
                        <Search className="w-6 h-6" />
                        <span className="uppercase tracking-wide">Tìm Chuyến Xe</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

            </form>

            {/* Quick Suggestions */}
            <div className="mt-8 pt-6 border-t border-slate-100">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Tuyến đường phổ biến
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {POPULAR_ROUTES.slice(0, 4).map((r, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => {
                                setFrom(r.from);
                                setTo(r.to);
                                // Calculate price immediately
                                let price = r.price;
                                if (serviceType === 'bao-xe') price *= 3;
                                if (serviceType === 'gui-do') price = Math.floor(price * 0.4);
                                setEstimatedPrice(price);
                            }}
                            className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 hover:shadow-md transition-all group cursor-pointer"
                        >
                            <div className="flex items-center gap-2 text-slate-700 font-bold text-sm group-hover:text-amber-700 mb-1">
                                <span>{r.from}</span>
                                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-amber-500" />
                                <span>{r.to}</span>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                Từ {r.price.toLocaleString()}đ
                            </span>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}

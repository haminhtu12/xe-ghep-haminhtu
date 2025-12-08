'use client';

import { useState } from 'react';
import { MapPin, Calendar, Search, ArrowRight, ArrowLeftRight, Package, Car, Users } from 'lucide-react';

// Danh sách 63 tỉnh thành Việt Nam
const CITIES = [
    // Miền Bắc
    'Hà Nội', 'Hải Phòng', 'Quảng Ninh', 'Hải Dương', 'Hưng Yên', 'Bắc Ninh',
    'Vĩnh Phúc', 'Thái Nguyên', 'Phú Thọ', 'Bắc Giang', 'Lạng Sơn', 'Cao Bằng',
    'Hà Giang', 'Tuyên Quang', 'Yên Bái', 'Lào Cai', 'Điện Biên', 'Lai Châu',
    'Sơn La', 'Hòa Bình', 'Ninh Bình', 'Nam Định', 'Thái Bình', 'Hà Nam',
    // Miền Trung
    'Thanh Hóa', 'Nghệ An', 'Hà Tĩnh', 'Quảng Bình', 'Quảng Trị', 'Thừa Thiên Huế',
    'Đà Nẵng', 'Quảng Nam', 'Quảng Ngãi', 'Bình Định', 'Phú Yên', 'Khánh Hòa',
    'Ninh Thuận', 'Bình Thuận', 'Kon Tum', 'Gia Lai', 'Đắk Lắk', 'Đắk Nông', 'Lâm Đồng',
    // Miền Nam
    'TP. Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Bà Rịa - Vũng Tàu', 'Tây Ninh',
    'Bình Phước', 'Long An', 'Tiền Giang', 'Bến Tre', 'Trà Vinh', 'Vĩnh Long',
    'Đồng Tháp', 'An Giang', 'Kiên Giang', 'Cần Thơ', 'Hậu Giang', 'Sóc Trăng',
    'Bạc Liêu', 'Cà Mau',
    // Sân bay
    'Sân bay Nội Bài', 'Sân bay Tân Sơn Nhất'
].sort();

// Các loại dịch vụ
const SERVICE_TYPES = [
    { id: 'xe-ghep', name: 'Xe ghép', icon: Users, color: 'sky' },
    { id: 'bao-xe', name: 'Bao xe', icon: Car, color: 'orange' },
    { id: 'gui-do', name: 'Gửi đồ', icon: Package, color: 'green' },
];

// Tuyến đường phổ biến
const POPULAR_ROUTES = [
    { from: 'Hà Nội', to: 'Ninh Bình', price: 180000, distance: 95 },
    { from: 'Hà Nội', to: 'Hải Phòng', price: 150000, distance: 105 },
    { from: 'Hà Nội', to: 'Quảng Ninh', price: 200000, distance: 165 },
    { from: 'Hà Nội', to: 'Thái Bình', price: 120000, distance: 110 },
    { from: 'Hà Nội', to: 'Nam Định', price: 140000, distance: 90 },
    { from: 'Hà Nội', to: 'Thanh Hóa', price: 200000, distance: 150 },
    { from: 'Sân bay Nội Bài', to: 'Hà Nội', price: 200000, distance: 30 },
    { from: 'Sân bay Nội Bài', to: 'Hải Phòng', price: 350000, distance: 120 },
    { from: 'TP. Hồ Chí Minh', to: 'Vũng Tàu', price: 180000, distance: 125 },
    { from: 'TP. Hồ Chí Minh', to: 'Đà Lạt', price: 300000, distance: 300 },
];

export default function SearchForm() {
    const [serviceType, setServiceType] = useState('xe-ghep');
    const [from, setFrom] = useState('Hà Nội');
    const [to, setTo] = useState('Ninh Bình');
    const [date, setDate] = useState('');
    const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

    // Tính giá dựa trên tuyến đường và loại dịch vụ
    const calculatePrice = () => {
        const route = POPULAR_ROUTES.find(
            r => r.from === from && r.to === to
        );

        let basePrice = route ? route.price : Math.floor(Math.random() * 100 + 50) * 1500;

        // Điều chỉnh giá theo loại dịch vụ
        if (serviceType === 'bao-xe') {
            basePrice = basePrice * 3; // Bao xe đắt gấp 3
        } else if (serviceType === 'gui-do') {
            basePrice = Math.floor(basePrice * 0.4); // Gửi đồ rẻ hơn
        }

        setEstimatedPrice(basePrice);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        calculatePrice();
        console.log('Tìm kiếm:', { serviceType, from, to, date });
    };

    const swapLocations = () => {
        const temp = from;
        setFrom(to);
        setTo(temp);
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto">
            <form onSubmit={handleSearch} className="space-y-6">
                {/* Chọn loại dịch vụ */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-3">
                        Loại dịch vụ
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {SERVICE_TYPES.map((service) => {
                            const Icon = service.icon;
                            const isActive = serviceType === service.id;
                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => setServiceType(service.id)}
                                    className={`p-4 rounded-xl border-2 transition-all ${isActive
                                            ? `border-${service.color}-500 bg-${service.color}-50 shadow-md scale-105`
                                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? `text-${service.color}-600` : 'text-slate-400'
                                        }`} />
                                    <span className={`text-sm font-medium ${isActive ? `text-${service.color}-700` : 'text-slate-600'
                                        }`}>
                                        {service.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                    {/* Điểm đi */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <MapPin className="inline w-4 h-4 mr-1 text-sky-500" />
                            Điểm đi
                        </label>
                        <select
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-slate-900 bg-white appearance-none cursor-pointer"
                            required
                        >
                            {CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Nút đổi chiều */}
                    <button
                        type="button"
                        onClick={swapLocations}
                        className="mb-3 md:mb-0 p-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl hover:from-sky-600 hover:to-blue-700 transition-all hover:scale-110 shadow-md"
                        title="Đổi chiều"
                    >
                        <ArrowLeftRight className="w-5 h-5" />
                    </button>

                    {/* Điểm đến */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            <MapPin className="inline w-4 h-4 mr-1 text-orange-500" />
                            Điểm đến
                        </label>
                        <select
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-slate-900 bg-white appearance-none cursor-pointer"
                            required
                        >
                            {CITIES.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Ngày đi */}
                <div className="relative">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        <Calendar className="inline w-4 h-4 mr-1 text-purple-500" />
                        Ngày đi
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-200 outline-none transition-all text-slate-900"
                        required
                    />
                </div>

                {/* Hiển thị giá ước tính */}
                {estimatedPrice && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                        <p className="text-sm text-green-700 font-medium mb-1">
                            💰 Giá ước tính ({SERVICE_TYPES.find(s => s.id === serviceType)?.name}):
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                            {estimatedPrice.toLocaleString('vi-VN')} VNĐ
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                            * Tuyến {from} → {to} - Giá tham khảo
                        </p>
                    </div>
                )}

                {/* Nút tìm kiếm */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-sky-600 hover:to-blue-700 transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                >
                    <Search className="w-5 h-5" />
                    Tìm chuyến xe
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </form>

            {/* Tuyến đường phổ biến */}
            <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-sm font-medium text-slate-700 mb-3">
                    🔥 Tuyến đường phổ biến:
                </p>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_ROUTES.slice(0, 6).map((route, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => {
                                setFrom(route.from);
                                setTo(route.to);
                                const basePrice = route.price;
                                const adjustedPrice = serviceType === 'bao-xe' ? basePrice * 3 :
                                    serviceType === 'gui-do' ? Math.floor(basePrice * 0.4) : basePrice;
                                setEstimatedPrice(adjustedPrice);
                            }}
                            className="px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 text-sm rounded-lg border border-sky-200 transition-all hover:scale-105"
                        >
                            {route.from} ⇌ {route.to}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

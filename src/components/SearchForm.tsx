'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, ArrowLeftRight, Car, Users, Clock, User, Phone, FileText, Loader2 } from 'lucide-react';
import { generateDrivers } from '@/data/mockDrivers';

const SERVICE_TYPES = [
    { id: 'xe-ghep', name: 'Xe Tiện Chuyến', icon: Users, price: 400000, desc: 'Đi chung, tiết kiệm' },
    { id: 'bao-xe', name: 'Bao Xe Trọn Gói', icon: Car, price: 1100000, desc: 'Riêng tư, đưa đón tận nơi' },
];

export default function SearchForm() {
    const [serviceType, setServiceType] = useState('xe-ghep');
    const [direction, setDirection] = useState<'hn-th' | 'th-hn'>('hn-th');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [seatCount, setSeatCount] = useState(1);
    const [estimatedPrice, setEstimatedPrice] = useState<number>(400000);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Form data state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pickupAddress: '',
        dropoffAddress: '',
        note: '',
    });

    // State for random drivers
    const [activeDrivers, setActiveDrivers] = useState<any[]>([]);

    useEffect(() => {
        // Generate pool
        const pool = generateDrivers(50);

        // Pick 4 unique drivers, ensuring no duplicate avatars
        const uniqueDrivers: any[] = [];
        const usedAvatars = new Set();

        // Shuffle pool first
        const shuffled = [...pool].sort(() => 0.5 - Math.random());

        for (const driver of shuffled) {
            if (!usedAvatars.has(driver.avatar)) {
                uniqueDrivers.push(driver);
                usedAvatars.add(driver.avatar);
            }
            if (uniqueDrivers.length >= 4) break;
        }

        setActiveDrivers(uniqueDrivers);
    }, []);

    // Auto-update price when service changes
    useEffect(() => {
        const service = SERVICE_TYPES.find(s => s.id === serviceType);
        if (service) {
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    serviceType,
                    direction,
                    date,
                    estimatedPrice,
                    seatCount: serviceType === 'xe-ghep' ? seatCount : 1,
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
                // Reset form
                setFormData({
                    name: '',
                    phone: '',
                    pickupAddress: '',
                    dropoffAddress: '',
                    note: '',
                });
            } else {
                alert('Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Có lỗi kết nối. Vui lòng kiểm tra mạng.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/50 p-6 lg:p-10 max-w-5xl mx-auto relative z-10 border border-slate-100">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-5 bg-amber-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-amber-500/30 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Chạy liên tục 24/7
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 mt-2">

                {/* Service Type Selection - Big Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Date & Seat Count */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                {/* Price Display */}
                <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold text-slate-600">
                            {serviceType === 'xe-ghep' ? 'Tổng tiền:' : 'Giá ước tính:'}
                        </span>
                        <div className="text-right">
                            <span className="text-2xl font-bold text-emerald-600">
                                {serviceType !== 'xe-ghep' && <span className="text-sm font-semibold text-slate-500 mr-1">Từ </span>}
                                {estimatedPrice.toLocaleString('vi-VN')}đ
                            </span>
                            {serviceType === 'bao-xe' && (
                                <p className="text-xs text-slate-500 mt-1">Tùy loại xe 4-7 chỗ</p>
                            )}
                        </div>
                    </div>
                    {serviceType !== 'xe-ghep' && (
                        <div className="pt-2 border-t border-emerald-200 mt-2">
                            <p className="text-xs text-slate-600 flex items-start gap-1">
                                <span>💬</span>
                                <span>Giá cuối cùng sẽ được xác nhận khi tài xế liên hệ lại với bạn</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Booking Form Fields */}
                {!isSuccess ? (
                    <>
                        <div className="border-t border-slate-200 pt-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4">Thông tin đặt xe</h3>

                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        <User className="w-4 h-4 inline mr-1" />
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Nguyễn Văn A"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="0912 xxx xxx"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>

                                {/* Pickup Address */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Điểm đón
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ví dụ: 123 Trần Phú, Ba Đình, Hà Nội"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                                        value={formData.pickupAddress}
                                        onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                                    />
                                </div>

                                {/* Dropoff Address */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Điểm trả (Tùy chọn)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Ví dụ: 456 Quang Trung, Thanh Hóa (Có thể để trống)"
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                                        value={formData.dropoffAddress}
                                        onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                                    />
                                </div>

                                {/* Note */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        <FileText className="w-4 h-4 inline mr-1" />
                                        Ghi chú (Tùy chọn)
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Thời gian đón mong muốn, yêu cầu đặc biệt..."
                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all resize-none"
                                        value={formData.note}
                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-5 px-8 rounded-2xl font-bold text-xl shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    Đang xử lý...
                                </>
                            ) : (
                                <>
                                    <span>ĐẶT XE NGAY</span>
                                    <ArrowRight className="w-6 h-6" />
                                </>
                            )}
                        </button>
                    </>
                ) : (
                    /* Success Message */
                    <div className="border-t border-slate-200 pt-6">
                        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-2">Đặt xe thành công!</h3>
                            <p className="text-slate-600 mb-6">
                                Chúng tôi sẽ liên hệ lại với bạn trong vòng <span className="font-bold text-amber-600">5 phút</span>.
                            </p>
                            <button
                                type="button"
                                onClick={() => setIsSuccess(false)}
                                className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors"
                            >
                                Đặt xe mới
                            </button>
                        </div>
                    </div>
                )}

                {/* Live Driver Feed - Social Proof (Randomized) */}
                <div className="pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Tài xế đang chờ khách
                        </h4>
                        <span className="text-xs text-amber-600 font-semibold cursor-pointer hover:underline">Xem tất cả ›</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {activeDrivers.map((driver, i) => (
                            <div key={i} className="flex flex-col gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 transition-colors group overflow-hidden">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full border-2 border-white shadow-sm relative shrink-0">
                                        <img
                                            src={driver.avatar}
                                            alt={driver.name}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-bold text-slate-800 truncate">{driver.name}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                                                    ⭐ {driver.rating}
                                                </span>
                                                <div className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wide">
                                                    Đã xác thực
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                                            <Car className="w-3 h-3" /> {driver.car}
                                        </p>
                                    </div>
                                </div>

                                {/* Car Image Preview */}
                                <div className="relative w-full h-24 rounded-lg overflow-hidden group-hover:shadow-md transition-all">
                                    <img
                                        src={driver.carImg}
                                        alt={driver.car}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-2 left-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full font-medium flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {driver.loc}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </form >
        </div >
    );
}


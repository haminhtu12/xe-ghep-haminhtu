'use client';

import { useState, useEffect } from 'react';
import { MapPin, Calendar, ArrowRight, ArrowLeftRight, Car, Users, Clock, User, Phone, FileText, Loader2, ChevronRight, ChevronLeft, Check, X, Search } from 'lucide-react';
import { generateDrivers } from '@/data/mockDrivers';

const SERVICE_TYPES = [
    { id: 'xe-ghep', name: 'Xe Tiện Chuyến', icon: Users, price: 400000, desc: 'Đi chung, tiết kiệm' },
    { id: 'bao-xe', name: 'Bao Xe Trọn Gói', icon: Car, price: 1300000, desc: 'Riêng tư, đưa đón tận nơi' },
];

const VEHICLE_TYPES = [
    { id: '4-5-cho', name: 'Xe 4-5 chỗ', price: 1300000 },
    { id: '7-cho', name: 'Xe 7 chỗ', price: 1500000 },
];

export default function SearchForm() {
    const [step, setStep] = useState(1); // 1: Trip Info, 2: Personal Info, 3: Confirm
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [serviceType, setServiceType] = useState('xe-ghep');
    const [direction, setDirection] = useState<'hn-th' | 'th-hn'>('hn-th');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [time, setTime] = useState('08:00'); // Default time
    const [seatCount, setSeatCount] = useState(1);
    const [vehicleType, setVehicleType] = useState('4-5-cho');
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

    // Address Autocomplete State
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSearchingAddress, setIsSearchingAddress] = useState(false);

    const handleAddressSearch = async (query: string) => {
        setFormData({ ...formData, pickupAddress: query });
        if (query.length < 3) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        setIsSearchingAddress(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5`);
            const data = await response.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Error fetching address:', error);
        } finally {
            setIsSearchingAddress(false);
        }
    };

    const selectAddress = (address: any) => {
        setFormData({ ...formData, pickupAddress: address.display_name });
        setSuggestions([]);
        setShowSuggestions(false);
    };

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
            } else if (service.id === 'bao-xe') {
                const vehicle = VEHICLE_TYPES.find(v => v.id === vehicleType);
                setEstimatedPrice(vehicle?.price || service.price);
            } else {
                setEstimatedPrice(service.price);
            }
        }
    }, [serviceType, seatCount, vehicleType]);

    const toggleDirection = () => {
        setDirection(prev => prev === 'hn-th' ? 'th-hn' : 'hn-th');
    };

    const handleNextStep = () => {
        if (step === 1) {
            setStep(2);
            setIsModalOpen(true);
        } else if (step === 2) {
            // Basic validation
            if (!formData.name || !formData.phone || !formData.pickupAddress) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc');
                return;
            }
            setStep(3);
        }
    };

    const handlePrevStep = () => {
        if (step === 2) {
            setIsModalOpen(false);
            setStep(1);
        } else {
            setStep(prev => Math.max(1, prev - 1));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setStep(1);
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
                    time,
                    estimatedPrice,
                    seatCount: serviceType === 'xe-ghep' ? seatCount : 1,
                    vehicleType: serviceType === 'bao-xe' ? vehicleType : null,
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
                setStep(1);
                // Keep modal open to show success message
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
        <>
            {/* INLINE FORM - STEP 1 ONLY */}
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 p-4 md:p-6 max-w-5xl mx-auto relative z-10 border border-slate-100">

                <div className="space-y-4 md:space-y-4">
                    {/* Service Type Selection */}
                    <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                        {SERVICE_TYPES.map((service) => {
                            const isActive = serviceType === service.id;
                            const Icon = service.icon;
                            return (
                                <button
                                    key={service.id}
                                    type="button"
                                    onClick={() => setServiceType(service.id)}
                                    className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-200 relative overflow-hidden ${isActive
                                        ? 'bg-white border-amber-500 shadow-sm ring-1 ring-amber-500'
                                        : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className={`p-2 rounded-full mb-2 ${isActive ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <span className={`font-bold text-sm ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{service.name}</span>
                                    <span className={`text-[10px] mt-1 ${isActive ? 'text-amber-600 font-medium' : 'text-slate-400'}`}>{service.desc}</span>

                                    {isActive && (
                                        <div className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Route Selection */}
                    <div className="bg-slate-50 p-4 md:p-6 rounded-3xl border border-slate-200 relative">
                        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 relative z-10">
                            {/* FROM */}
                            <div className="flex-1 w-full bg-white p-2 md:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 md:gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold shrink-0">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase block">Điểm đi</label>
                                    <p className="text-lg md:text-xl font-bold text-slate-800">
                                        {direction === 'hn-th' ? 'Hà Nội' : 'Thanh Hóa'}
                                    </p>
                                </div>
                            </div>

                            {/* SWAP BUTTON */}
                            <button
                                type="button"
                                onClick={toggleDirection}
                                className="w-12 h-12 md:w-14 md:h-14 bg-white rounded-full border border-slate-200 shadow-md flex items-center justify-center text-amber-500 hover:scale-110 hover:shadow-lg hover:border-amber-200 transition-all rotate-90 md:rotate-0"
                            >
                                <ArrowLeftRight className="w-6 h-6" />
                            </button>

                            {/* TO */}
                            <div className="flex-1 w-full bg-white p-2 md:p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 md:gap-4">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold shrink-0">
                                    <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                                </div>
                                <div>
                                    <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase block">Điểm đến</label>
                                    <p className="text-lg md:text-xl font-bold text-slate-800">
                                        {direction === 'hn-th' ? 'Thanh Hóa' : 'Hà Nội'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-slate-200 border-t border-dashed border-slate-300 -z-0"></div>
                    </div>

                    {/* Date & Time & Seat Count */}
                    <div className="grid grid-cols-12 gap-3">
                        {/* Date Picker (5 cols) */}
                        <div className="col-span-7 bg-slate-50 p-3 md:p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2 cursor-pointer hover:border-amber-200 transition-colors">
                            <Calendar className="w-7 h-7 md:w-8 md:h-8 text-amber-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Ngày đi</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="bg-transparent w-full text-sm md:text-base font-bold text-slate-800 outline-none cursor-pointer p-0"
                                />
                            </div>
                        </div>

                        {/* Time Picker (5 cols) */}
                        <div className="col-span-5 bg-slate-50 p-3 md:p-2.5 rounded-2xl border border-slate-200 flex items-center gap-2 cursor-pointer hover:border-amber-200 transition-colors">
                            <Clock className="w-6 h-6 md:w-7 md:h-7 text-amber-500 shrink-0" />
                            <div className="flex-1 min-w-0">
                                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">Giờ đón</label>
                                <select
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="bg-transparent w-full text-sm md:text-base font-bold text-slate-800 outline-none cursor-pointer p-0 appearance-none"
                                >
                                    {Array.from({ length: 24 }).map((_, i) => {
                                        const h = i.toString().padStart(2, '0');
                                        return (
                                            <option key={h} value={`${h}:00`}>{`${h}:00`}</option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Seat Selection (Full width on mobile, or integrated) */}
                        {serviceType === 'xe-ghep' && (
                            <div className="col-span-12 bg-slate-50 p-3 md:p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">Số ghế</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white rounded-full px-3 py-1.5 border border-slate-100 shadow-sm">
                                    <button
                                        type="button"
                                        onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-amber-600 font-bold text-lg active:scale-90 transition-transform rounded-full hover:bg-slate-50"
                                    >
                                        -
                                    </button>
                                    <span className="text-base font-bold text-slate-900 w-5 text-center">{seatCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => setSeatCount(Math.min(7, seatCount + 1))}
                                        className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-amber-600 font-bold text-lg active:scale-90 transition-transform rounded-full hover:bg-slate-50"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Vehicle Type Selection (Only for Bao Xe) */}
                    {serviceType === 'bao-xe' && (
                        <div className="col-span-2">
                            <label className="text-sm font-bold text-slate-700 mb-3 block">
                                <Car className="w-4 h-4 inline mr-1" />
                                Chọn loại xe
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {VEHICLE_TYPES.map((vehicle) => {
                                    const isActive = vehicleType === vehicle.id;
                                    return (
                                        <button
                                            key={vehicle.id}
                                            type="button"
                                            onClick={() => setVehicleType(vehicle.id)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-200 ${isActive
                                                ? 'bg-white border-amber-400 shadow-md'
                                                : 'bg-white border-slate-200 hover:border-amber-200'
                                                }`}
                                        >
                                            <div className="text-center">
                                                <p className={`font-bold text-sm mb-1 ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                                                    {vehicle.name}
                                                </p>
                                                <p className={`text-xs font-semibold ${isActive ? 'text-amber-600' : 'text-slate-400'}`}>
                                                    {vehicle.price.toLocaleString('vi-VN')}đ
                                                </p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Continue Button (Triggers Modal) */}
                <div className="pt-2 md:pt-4">
                    <button
                        type="button"
                        onClick={handleNextStep}
                        className="w-full bg-amber-500 text-white py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-lg md:text-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 flex items-center justify-center gap-3 group"
                    >
                        <span className="uppercase tracking-wide">Tiếp tục đặt xe</span>
                        <div className="bg-white/20 p-1 rounded-full group-hover:bg-white/30 transition-colors">
                            <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                    </button>
                </div>
            </div>

            {/* SLIDE-UP MODAL (STEPS 2 & 3) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={closeModal}
                    ></div>

                    {/* Modal Content */}
                    <div className="relative w-full md:max-w-2xl bg-white rounded-t-3xl md:rounded-3xl shadow-2xl h-[85vh] md:h-auto md:max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom duration-300 flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 md:p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handlePrevStep}
                                    className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                >
                                    <ChevronLeft className="w-6 h-6 text-slate-600" />
                                </button>
                                <h3 className="text-lg font-bold text-slate-800">
                                    {step === 2 ? 'Thông tin liên hệ' : 'Xác nhận đặt xe'}
                                </h3>
                            </div>
                            <button
                                onClick={closeModal}
                                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="px-6 pt-4">
                            <div className="flex items-center justify-center gap-2">
                                <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-amber-500' : 'bg-slate-100'}`}></div>
                                <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-amber-500' : 'bg-slate-100'}`}></div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 md:p-8 flex-1 overflow-y-auto">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {!isSuccess ? (
                                    <>
                                        {/* STEP 2: PERSONAL INFO */}
                                        {step === 2 && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 mb-6">
                                                    <div className="p-2 bg-white rounded-full shadow-sm">
                                                        <Car className="w-5 h-5 text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">Chuyến đi của bạn</p>
                                                        <p className="text-slate-600 text-xs mt-0.5">
                                                            {direction === 'hn-th' ? 'Hà Nội ➝ Thanh Hóa' : 'Thanh Hóa ➝ Hà Nội'} • {new Date(date).toLocaleDateString('vi-VN')} • {time}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Name */}
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                                        Họ và tên <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        required
                                                        placeholder="Ví dụ: Nguyễn Văn A"
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-500"
                                                        value={formData.name}
                                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    />
                                                </div>

                                                {/* Phone */}
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                                        Số điện thoại <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        placeholder="Ví dụ: 0912 xxx xxx"
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-500"
                                                        value={formData.phone}
                                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    />
                                                </div>

                                                {/* Pickup Address with Autocomplete */}
                                                <div className="relative">
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                                        Điểm đón <span className="text-red-500">*</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            required
                                                            placeholder="Nhập địa chỉ đón..."
                                                            className="w-full px-4 py-3 pl-10 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-500"
                                                            value={formData.pickupAddress}
                                                            onChange={(e) => handleAddressSearch(e.target.value)}
                                                            onFocus={() => formData.pickupAddress && setShowSuggestions(true)}
                                                        />
                                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                                        {isSearchingAddress && (
                                                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-amber-500" />
                                                        )}
                                                    </div>

                                                    {/* Suggestions Dropdown */}
                                                    {showSuggestions && suggestions.length > 0 && (
                                                        <ul className="absolute z-50 w-full bg-white border border-slate-200 rounded-xl mt-1 shadow-xl max-h-60 overflow-y-auto">
                                                            {suggestions.map((item: any, index: number) => (
                                                                <li
                                                                    key={index}
                                                                    onClick={() => selectAddress(item)}
                                                                    className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-slate-100 last:border-0 text-sm text-slate-700 flex items-start gap-2"
                                                                >
                                                                    <MapPin className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                                                    <span>{item.display_name}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {/* Click outside to close - simple implementation */}
                                                    {showSuggestions && (
                                                        <div className="fixed inset-0 z-40" onClick={() => setShowSuggestions(false)}></div>
                                                    )}
                                                </div>

                                                {/* Dropoff Address */}
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                                        Điểm trả (Tùy chọn)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Ví dụ: 456 Quang Trung, Thanh Hóa"
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all placeholder:text-slate-500"
                                                        value={formData.dropoffAddress}
                                                        onChange={(e) => setFormData({ ...formData, dropoffAddress: e.target.value })}
                                                    />
                                                </div>

                                                {/* Note */}
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                                        Ghi chú (Tùy chọn)
                                                    </label>
                                                    <textarea
                                                        rows={3}
                                                        placeholder="Thời gian đón mong muốn, yêu cầu đặc biệt..."
                                                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all resize-none placeholder:text-slate-500"
                                                        value={formData.note}
                                                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* STEP 3: CONFIRMATION */}
                                        {step === 3 && (
                                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-4">
                                                    {/* Trip Details Card */}
                                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Chi tiết chuyến đi</h4>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <span className="text-slate-500 text-xs block mb-1">Loại dịch vụ</span>
                                                                <span className="font-bold text-slate-800 text-sm">{SERVICE_TYPES.find(s => s.id === serviceType)?.name}</span>
                                                            </div>
                                                            <div>
                                                                <span className="text-slate-500 text-xs block mb-1">Ngày đi</span>
                                                                <span className="font-bold text-slate-800 text-sm">{new Date(date).toLocaleDateString('vi-VN')}</span>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <span className="text-slate-500 text-xs block mb-1">Hành trình</span>
                                                                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                                                                    <span className="text-blue-600">{direction === 'hn-th' ? 'Hà Nội' : 'Thanh Hóa'}</span>
                                                                    <ArrowRight className="w-4 h-4 text-slate-400" />
                                                                    <span className="text-orange-600">{direction === 'hn-th' ? 'Thanh Hóa' : 'Hà Nội'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Customer Details Card */}
                                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-wider">Thông tin khách hàng</h4>
                                                        <div className="space-y-3">
                                                            <div className="flex items-start gap-3">
                                                                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                                                                <div>
                                                                    <span className="font-bold text-slate-800 text-sm block">{formData.name}</span>
                                                                    <span className="text-slate-500 text-xs">{formData.phone}</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-start gap-3">
                                                                <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                                                                <div>
                                                                    <span className="text-slate-500 text-xs block">Điểm đón</span>
                                                                    <span className="font-bold text-slate-800 text-sm">{formData.pickupAddress}</span>
                                                                </div>
                                                            </div>
                                                            {formData.dropoffAddress && (
                                                                <div className="flex items-start gap-3">
                                                                    <MapPin className="w-4 h-4 text-orange-500 mt-0.5" />
                                                                    <div>
                                                                        <span className="text-slate-500 text-xs block">Điểm trả</span>
                                                                        <span className="font-bold text-slate-800 text-sm">{formData.dropoffAddress}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Total Price */}
                                                    <div className="flex justify-between border-b border-slate-200 pb-2">
                                                        <span className="text-slate-500 text-sm">Ngày đi</span>
                                                        <span className="font-bold text-slate-800">{new Date(date).toLocaleDateString('vi-VN')} - {time}</span>
                                                    </div>
                                                </div>

                                                {/* Live Driver Feed - Social Proof (Only show in Step 3) */}
                                                <div className="pt-4 border-t border-slate-100">
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
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    /* Success Message */
                                    <div className="flex flex-col items-center justify-center h-full py-10">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
                                            <Check className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Đặt xe thành công!</h3>
                                        <p className="text-slate-600 mb-8 text-center max-w-xs">
                                            Chúng tôi sẽ liên hệ lại với bạn trong vòng <span className="font-bold text-amber-600">5 phút</span>.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsSuccess(false);
                                                closeModal();
                                            }}
                                            className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors w-full"
                                        >
                                            Hoàn tất
                                        </button>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Footer Buttons (Fixed at bottom of modal) */}
                        {!isSuccess && (
                            <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                                {step < 3 ? (
                                    <button
                                        type="button"
                                        onClick={handleNextStep}
                                        className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                                    >
                                        Tiếp tục
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <span>XÁC NHẬN ĐẶT XE</span>
                                                <Check className="w-6 h-6" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

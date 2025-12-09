'use client';

import { useState, useEffect } from 'react';
import { X, CheckCircle, Phone, MapPin, User, FileText, Loader2, Users, Car, Package } from 'lucide-react';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingData: {
        serviceType: string;
        direction: string;
        estimatedPrice: number;
        seatCount?: number;
    };
}

const SERVICE_TYPES = [
    { id: 'xe-ghep', name: 'Xe Ghép', icon: Users, basePrice: 400000 },
    { id: 'bao-xe', name: 'Bao Xe', icon: Car, basePrice: 1100000 },
    { id: 'gui-do', name: 'Gửi Hàng', icon: Package, basePrice: 100000 },
];

export default function BookingModal({ isOpen, onClose, bookingData }: BookingModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [isLoading, setIsLoading] = useState(false);

    // Internal state for service type and seat count
    const [selectedService, setSelectedService] = useState(bookingData.serviceType);
    const [seatCount, setSeatCount] = useState(bookingData.seatCount || 1);
    const [estimatedPrice, setEstimatedPrice] = useState(bookingData.estimatedPrice);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pickupAddress: '',
        dropoffAddress: '',
        note: '',
        // For package delivery
        packageWeight: '',
        packageDescription: '',
    });

    // Update price when service or seat count changes
    useEffect(() => {
        const service = SERVICE_TYPES.find(s => s.id === selectedService);
        if (service) {
            if (service.id === 'xe-ghep') {
                setEstimatedPrice(service.basePrice * seatCount);
            } else {
                setEstimatedPrice(service.basePrice);
            }
        }
    }, [selectedService, seatCount]);

    if (!isOpen) return null;

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
                    serviceType: selectedService,
                    direction: bookingData.direction,
                    estimatedPrice,
                    seatCount: selectedService === 'xe-ghep' ? seatCount : 1,
                }),
            });

            if (response.ok) {
                setStep('success');
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

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const getServiceName = (id: string) => {
        return SERVICE_TYPES.find(s => s.id === id)?.name || id;
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative max-h-[90vh] overflow-y-auto">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {step === 'form' ? (
                    <>
                        {/* Header */}
                        <div className="bg-slate-50 p-6 border-b border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800">Xác nhận đặt xe</h3>
                            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                                <span className="font-semibold text-amber-600">
                                    {bookingData.direction === 'hn-th' ? 'Hà Nội ➝ Thanh Hóa' : 'Thanh Hóa ➝ Hà Nội'}
                                </span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">

                            {/* Service Type Selection */}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3">Loại dịch vụ</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {SERVICE_TYPES.map((service) => {
                                        const Icon = service.icon;
                                        const isActive = selectedService === service.id;
                                        return (
                                            <button
                                                key={service.id}
                                                type="button"
                                                onClick={() => setSelectedService(service.id)}
                                                className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${isActive
                                                        ? 'bg-amber-50 border-amber-500 shadow-md'
                                                        : 'bg-white border-slate-200 hover:border-amber-300'
                                                    }`}
                                            >
                                                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-amber-600' : 'text-slate-400'}`} />
                                                <span className={`text-xs font-semibold ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>
                                                    {service.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Seat Count (Only for Xe Ghep) */}
                            {selectedService === 'xe-ghep' && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Số ghế</label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                                            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 font-bold transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-2xl font-bold text-slate-800 min-w-[60px] text-center">
                                            {seatCount}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setSeatCount(Math.min(7, seatCount + 1))}
                                            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-amber-100 text-slate-700 font-bold transition-colors"
                                        >
                                            +
                                        </button>
                                        <span className="text-sm text-slate-500 ml-2">Tối đa 7 ghế</span>
                                    </div>
                                </div>
                            )}

                            {/* Package Details (Only for Gui Hang) */}
                            {selectedService === 'gui-do' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Khối lượng hàng (kg)</label>
                                        <input
                                            type="number"
                                            placeholder="Ví dụ: 5"
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                                            value={formData.packageWeight}
                                            onChange={(e) => setFormData({ ...formData, packageWeight: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mô tả hàng hóa</label>
                                        <input
                                            type="text"
                                            placeholder="Ví dụ: Quần áo, điện tử..."
                                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all"
                                            value={formData.packageDescription}
                                            onChange={(e) => setFormData({ ...formData, packageDescription: e.target.value })}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Price Display */}
                            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-semibold text-slate-600">Tổng tiền ước tính:</span>
                                    <span className="text-2xl font-bold text-emerald-600">
                                        {estimatedPrice.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            </div>

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
                                    placeholder={bookingData.direction === 'hn-th' ? 'Địa chỉ tại Hà Nội' : 'Địa chỉ tại Thanh Hóa'}
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
                                    placeholder={bookingData.direction === 'hn-th' ? 'Địa chỉ tại Thanh Hóa' : 'Địa chỉ tại Hà Nội'}
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Đang xử lý...
                                    </>
                                ) : (
                                    'Xác nhận đặt xe'
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    /* Success State */
                    <div className="p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-3">Đặt xe thành công!</h3>
                        <p className="text-slate-600 mb-6">
                            Chúng tôi sẽ liên hệ lại với bạn trong vòng <span className="font-bold text-amber-600">5 phút</span>.
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-amber-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

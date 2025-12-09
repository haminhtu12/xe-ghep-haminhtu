'use client';

import { useState } from 'react';
import { X, CheckCircle, Phone, MapPin, User, FileText, Loader2 } from 'lucide-react';

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

export default function BookingModal({ isOpen, onClose, bookingData }: BookingModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        pickupAddress: '',
        dropoffAddress: '',
        note: '',
    });

    if (!isOpen) return null;

    // Use seatCount from props or default to 1 if undefined (legacy safety)
    const seatCount = bookingData.seatCount || 1;

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
                    ...bookingData,
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

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 relative">

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
                                <span>•</span>
                                <span>{seatCount} ghế</span>
                                <span>•</span>
                                <span className="font-bold text-emerald-600">
                                    {bookingData.estimatedPrice.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">


                            {/* Name & Phone */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Họ và tên <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                                        <User className="w-5 h-5 text-slate-400 shrink-0" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nguyễn Văn A"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="flex-1 outline-none font-medium bg-transparent"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại <span className="text-red-500">*</span></label>
                                    <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                                        <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="0912 345 678"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="flex-1 outline-none font-medium bg-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pickup Address */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Điểm đón chi tiết <span className="text-red-500">*</span></label>
                                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Số 10, Ngõ 5, Đường..."
                                        value={formData.pickupAddress}
                                        onChange={e => setFormData({ ...formData, pickupAddress: e.target.value })}
                                        className="flex-1 outline-none font-medium bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Dropoff Address (Optional) */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Điểm trả (Tùy chọn)</label>
                                <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Nhập điểm đến..."
                                        value={formData.dropoffAddress}
                                        onChange={e => setFormData({ ...formData, dropoffAddress: e.target.value })}
                                        className="flex-1 outline-none font-medium bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Note */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Ghi chú thêm</label>
                                <div className="flex items-start gap-2 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-200 transition-all">
                                    <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                    <textarea
                                        rows={2}
                                        placeholder="Mang theo nhiều hành lý, đi cùng trẻ em..."
                                        value={formData.note}
                                        onChange={e => setFormData({ ...formData, note: e.target.value })}
                                        className="flex-1 outline-none font-medium resize-none bg-transparent"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Đang gửi...
                                    </>
                                ) : (
                                    'Xác nhận đặt xe'
                                )}
                            </button>
                        </form>
                    </>
                ) : (
                    /* Success View */
                    <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-2 animate-bounce">
                            <CheckCircle className="w-10 h-10" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800">Đặt xe thành công!</h3>
                        <p className="text-slate-500 max-w-xs mx-auto">
                            Cảm ơn bạn đã tin tưởng. Nhà xe đã nhận được thông tin và sẽ liên hệ lại với bạn trong ít phút để xác nhận chuyến đi.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Hoàn tất
                        </button>
                    </div>
                )}
            </div>
        </div >
    );
}

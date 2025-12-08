'use client';

import { useState } from 'react';
import { X, CheckCircle, Phone, MapPin, User, FileText } from 'lucide-react';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, we would send this data to an API
        console.log('Booking Data:', { ...formData, ...bookingData });
        setStep('success');
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
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
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nguyễn Văn A"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                        <input
                                            type="tel"
                                            required
                                            placeholder="0912 345 678"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pickup Address */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Điểm đón chi tiết <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        placeholder="Số 10, Ngõ 5, Đường..."
                                        value={formData.pickupAddress}
                                        onChange={e => setFormData({ ...formData, pickupAddress: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* Dropoff Address (Optional) */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Điểm trả (Tùy chọn)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <input
                                        type="text"
                                        placeholder="Nhập điểm đến..."
                                        value={formData.dropoffAddress}
                                        onChange={e => setFormData({ ...formData, dropoffAddress: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {/* Note */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-500 uppercase">Ghi chú thêm</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                                    <textarea
                                        rows={2}
                                        placeholder="Mang theo nhiều hành lý, đi cùng trẻ em..."
                                        value={formData.note}
                                        onChange={e => setFormData({ ...formData, note: e.target.value })}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all font-medium resize-none"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all mt-2"
                            >
                                Xác nhận đặt xe
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
                            Cảm ơn bạn, tài xế sẽ gọi điện xác nhận lại với bạn trong vòng <span className="font-bold text-slate-800">5 phút</span> nữa.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-4 px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                        >
                            Đóng cửa sổ này
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

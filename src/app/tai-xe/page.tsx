'use client';

import { useState } from 'react';
import { Shield, Car, CheckCircle, DollarSign, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function DriverRegistration() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        carType: 'Xe 4 chỗ',
        licensePlate: ''
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch('/api/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Đăng ký thành công! Chúng tôi sẽ liên hệ lại sớm.');
                setFormData({
                    name: '',
                    phone: '',
                    carType: 'Xe 4 chỗ',
                    licensePlate: ''
                });
            } else {
                alert('Có lỗi xảy ra: ' + (data.error || 'Vui lòng thử lại.'));
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Có lỗi xảy ra. Vui lòng kiểm tra lại kết nối.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section with Launch Promotion */}
            <div className="bg-slate-900 text-white relative overflow-hidden py-20 px-4">
                {/* Abstract Background */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600 rounded-full blur-[80px] opacity-20 -ml-10 -mb-10"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/50 backdrop-blur-sm mb-6 animate-bounce">
                        <span className="text-xl">🎁</span>
                        <span className="text-sm font-bold text-amber-500 uppercase">Ưu đãi ra mắt</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Tăng Thu Nhập Tự Động <br />
                        <span className="text-amber-500">Không Cần Tìm Khách</span>
                    </h1>

                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
                        Hệ thống tự động gửi thông báo khi có khách tiện chuyến. <br />
                        Bạn chỉ việc nhận cuốc và chạy. Không cắt phế, không ràng buộc.
                    </p>

                    {/* FOMO / Incentive Banner */}
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-1 max-w-2xl mx-auto transform hover:scale-105 transition-transform duration-300 shadow-2xl shadow-amber-500/20">
                        <div className="bg-slate-900 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-left">
                                <p className="text-amber-500 font-bold text-xs uppercase tracking-wider mb-1">Dành cho 100 đối tác đầu tiên</p>
                                <p className="text-white font-bold text-lg">Tặng ngay <span className="text-amber-400 text-2xl">500.000đ</span> vào tài khoản</p>
                            </div>
                            <div className="bg-white text-orange-600 font-bold px-4 py-2 rounded-lg text-sm whitespace-nowrap shadow-md">
                                🔥 Chỉ còn 12 slot
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-20 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Benefits Card */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 h-fit">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Quyền lợi đối tác</h2>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                                    <DollarSign className="w-6 h-6 text-emerald-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Thu nhập hấp dẫn</h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Trung bình 10-15 triệu/tháng từ các chuyến xe tiện chuyến, lấp đầy ghế trống.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Tự chủ thời gian</h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        Chạy lúc nào tùy bạn. Không áp doanh số. Hệ thống chỉ bắn cuốc khi bạn rảnh.
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                                    <Users className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800 text-lg">Khách hàng văn minh</h3>
                                    <p className="text-slate-500 text-sm mt-1">
                                        100% khách hàng đã xác thực SĐT. Hạn chế tối đa tình trạng bom hàng.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Registration Form */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800">Đăng ký ngay</h2>
                            <p className="text-slate-500 text-sm mt-2">Điền thông tin để tham gia đội ngũ tài xế chuyên nghiệp</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Nguyễn Văn A"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại (Zalo)</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="0912 xxx xxx"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Loại xe</label>
                                    <select
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium bg-white"
                                        value={formData.carType}
                                        onChange={e => setFormData({ ...formData, carType: e.target.value })}
                                    >
                                        <option value="Xe 4 chỗ">Xe 4 chỗ</option>
                                        <option value="Xe 7 chỗ">Xe 7 chỗ</option>
                                        <option value="Bán tải">Bán tải</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Biển số</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="30A-123.45"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 outline-none transition-all font-medium"
                                        value={formData.licensePlate}
                                        onChange={e => setFormData({ ...formData, licensePlate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Đang gửi...
                                    </>
                                ) : (
                                    'Gửi Đăng Ký'
                                )}
                            </button>

                            <div className="text-center">
                                <p className="text-xs text-slate-500">
                                    Bằng việc đăng ký, bạn đồng ý với <Link href="#" className="text-amber-600 hover:underline">Điều khoản sử dụng</Link> của chúng tôi.
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

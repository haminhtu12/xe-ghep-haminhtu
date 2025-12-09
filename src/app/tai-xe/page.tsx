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

                    {/* Registration CTA */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col justify-center items-center text-center">
                        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
                            <Car className="w-10 h-10 text-amber-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Tham gia ngay</h2>
                        <p className="text-slate-500 mb-8 text-lg max-w-md">
                            Chỉ cần số điện thoại. Đăng ký trong 30 giây. <br />
                            <span className="font-bold text-amber-600">Tặng ngay 500.000đ</span> vào tài khoản.
                        </p>

                        <Link
                            href="/tai-xe/login"
                            className="w-full max-w-sm bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl py-5 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                        >
                            Đăng Ký / Đăng Nhập
                        </Link>

                        <p className="mt-6 text-sm text-slate-400">
                            Đã có hơn 500+ tài xế tham gia tuần này
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

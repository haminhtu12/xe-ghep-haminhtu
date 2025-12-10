'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Car, CheckCircle, DollarSign, Clock, Users, Phone, Gift, KeyRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DriverRegistration() {
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const router = useRouter();

    // Countdown timer for resend OTP
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => {
                setResendCountdown(resendCountdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) {
            alert('Vui lòng nhập số điện thoại hợp lệ');
            return;
        }
        setLoading(true);

        try {
            const res = await fetch('/api/drivers/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();

            if (res.ok) {
                setStep('otp');
                setResendCountdown(60); // Start 60 second countdown
                if (data.devMode && data.otp) {
                    // Development mode: Show OTP in alert
                    alert(`[DEV MODE] Mã OTP của bạn là: ${data.otp}\n\nMã này có hiệu lực trong 5 phút.`);
                } else {
                    alert('Mã OTP đã được gửi đến số điện thoại của bạn. Vui lòng kiểm tra tin nhắn.');
                }
            } else {
                alert(data.error || 'Không thể gửi mã OTP. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Send OTP error:', error);
            alert('Có lỗi xảy ra. Vui lòng kiểm tra kết nối và thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/drivers/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, otp }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.isNew) {
                    alert(`🎉 ${data.message}`);
                } else {
                    alert(data.message);
                }
                router.push('/tai-xe/dashboard');
            } else {
                alert(data.error || 'Xác thực thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
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
                                <p className="text-white font-bold text-lg">Tặng ngay <span className="text-amber-400 text-2xl">150.000đ</span> vào tài khoản</p>
                            </div>
                            <Link href="/tai-xe/login" className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20">
                                Đăng ký ngay
                            </Link>
                        </div>
                        <div className="bg-white text-orange-600 font-bold px-4 py-2 rounded-b-xl text-sm whitespace-nowrap shadow-md text-center">
                            🔥 Chỉ còn 12 slot
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

                    {/* Registration Form - Embedded */}
                    <div className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100">
                        <div className="flex justify-center mb-6">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center animate-pulse">
                                <Car className="w-8 h-8 text-amber-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-2 text-center">Đăng ký ngay</h2>
                        <p className="text-slate-500 mb-6 text-center">
                            Chỉ cần 30 giây. <span className="font-bold text-amber-600">Tặng ngay 150.000đ</span>
                        </p>

                        {/* Promotion Banner */}
                        <div className="mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
                                <Gift className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800">Quà tặng thành viên mới</p>
                                <p className="text-xs text-slate-600">Tặng ngay <span className="text-amber-600 font-bold">150.000đ</span> khi đăng nhập lần đầu.</p>
                            </div>
                        </div>

                        {step === 'phone' ? (
                            <form className="space-y-6" onSubmit={handleSendOtp}>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Số điện thoại
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            placeholder="0912 xxx xxx"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 transition-all"
                                >
                                    {loading ? 'Đang gửi...' : (
                                        <>
                                            Lấy Mã Xác Thực <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : (
                            <form className="space-y-6" onSubmit={handleVerifyOtp}>
                                <div className="text-center mb-4">
                                    <p className="text-sm text-slate-500">Mã xác thực đã gửi đến</p>
                                    <p className="font-bold text-lg text-slate-800">{phone}</p>
                                    <div className="flex items-center justify-center gap-2 mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setStep('phone')}
                                            className="text-xs text-amber-600 hover:underline"
                                        >
                                            Đổi số điện thoại
                                        </button>
                                        <span className="text-slate-300">•</span>
                                        <button
                                            type="button"
                                            onClick={handleSendOtp}
                                            disabled={resendCountdown > 0 || loading}
                                            className="text-xs text-amber-600 hover:underline disabled:text-slate-400 disabled:no-underline disabled:cursor-not-allowed"
                                        >
                                            {resendCountdown > 0
                                                ? `Gửi lại sau ${resendCountdown}s`
                                                : 'Gửi lại mã OTP'}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Nhập mã OTP (6 số)
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <KeyRound className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-colors tracking-widest text-lg font-bold text-center"
                                            placeholder="123456"
                                        />
                                    </div>
                                    <p className="mt-2 text-xs text-center text-slate-500">
                                        Mã mặc định cho bản thử nghiệm: <span className="font-mono font-bold text-slate-800">123456</span>
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 transition-all"
                                >
                                    {loading ? 'Đang kiểm tra...' : (
                                        <>
                                            Đăng Nhập <ArrowRight className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                        <p className="mt-6 text-sm text-slate-400 text-center">
                            Đã có hơn 500+ tài xế tham gia tuần này
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

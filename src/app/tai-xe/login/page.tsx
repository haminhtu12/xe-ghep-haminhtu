'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Phone, Lock, ArrowRight, Gift, KeyRound } from 'lucide-react';

export default function DriverLogin() {
    const [step, setStep] = useState<'phone' | 'otp' | 'password' | 'create-password'>('phone');
    const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [isNewDriver, setIsNewDriver] = useState(false);
    const [verifiedOtp, setVerifiedOtp] = useState(''); // Store verified OTP
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
                body: JSON.stringify({
                    phone,
                    otp,
                    password: step === 'create-password' ? password : undefined
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Check if this is a new driver who needs to set password
                if (data.needPassword && step !== 'create-password') {
                    setIsNewDriver(true);
                    setVerifiedOtp(otp); // Save verified OTP
                    setStep('create-password');
                    setOtp(''); // Clear OTP from input for security
                    alert(data.message || 'OTP xác thực thành công! Vui lòng tạo mật khẩu.');
                    return;
                }

                // Login successful
                if (data.isNew) {
                    alert(`🎉 ${data.message}`);
                } else {
                    alert(data.message || 'Đăng nhập thành công!');
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

    const handleLoginWithPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/drivers/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, password }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message);
                router.push('/tai-xe/dashboard');
            } else {
                alert(data.error || 'Đăng nhập thất bại.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert('Mật khẩu xác nhận không khớp!');
            return;
        }

        if (password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/drivers/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    otp: verifiedOtp, // Use the verified OTP
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(`🎉 ${data.message}`);
                router.push('/tai-xe/dashboard');
            } else {
                alert(data.error || 'Không thể hoàn tất đăng ký. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Create password error:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-amber-500 rounded-[1.2rem] flex items-center justify-center shadow-xl transform -rotate-3 mb-2">
                        <Car className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-[2rem] font-black text-slate-900 tracking-tight leading-none">
                    Dành Cho Tài Xế
                </h2>
                <p className="mt-3 text-center text-sm font-medium text-slate-500">
                    {step === 'create-password' ? 'Tạo mật khẩu để bảo mật tài khoản' : 'Đăng nhập nhanh bằng OTP hoặc Mật khẩu'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white py-8 px-6 shadow-2xl rounded-[2rem] sm:px-10 border border-slate-100/50">

                    {/* Promotion Banner - Refined */}
                    <div className="mb-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-amber-100">
                            <Gift className="w-6 h-6 text-amber-500" />
                        </div>
                        <div>
                            <p className="text-[15px] font-bold text-slate-900 leading-tight">Quà tặng thành viên mới</p>
                            <p className="text-sm text-slate-500 mt-0.5">Tặng ngay <span className="text-amber-600 font-black text-base">150.000đ</span> khi đăng nhập.</p>
                        </div>
                    </div>

                    {/* Tab switcher for login method - Pill Style */}
                    {step === 'phone' && (
                        <div className="flex p-1.5 mb-8 bg-slate-50 rounded-2xl border border-slate-100">
                            <button
                                type="button"
                                onClick={() => setLoginMethod('otp')}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 leading-none ${loginMethod === 'otp'
                                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] border border-slate-100'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                                    }`}
                            >
                                Đăng nhập OTP
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoginMethod('password');
                                    setStep('password');
                                }}
                                className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 leading-none ${loginMethod === 'password'
                                    ? 'bg-white text-slate-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] border border-slate-100'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100/50'
                                    }`}
                            >
                                Mật khẩu
                            </button>
                        </div>
                    )}

                    {step === 'phone' && loginMethod === 'otp' ? (
                        <form className="space-y-8" onSubmit={handleSendOtp}>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <Phone className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="block w-full pl-[3.5rem] pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg"
                                        placeholder="0912 xxx xxx"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all"
                            >
                                {loading ? 'Đang gửi...' : (
                                    <>
                                        Lấy Mã Xác Thực <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : step === 'password' ? (
                        <form className="space-y-6" onSubmit={handleLoginWithPassword}>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <Phone className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="tel"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="block w-full pl-[3.5rem] pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg"
                                        placeholder="0912 xxx xxx"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-[3.5rem] pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm px-1">
                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="text-slate-500 font-medium hover:text-slate-800 transition-colors"
                                >
                                    ← Quay lại
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoginMethod('otp');
                                        setStep('phone');
                                    }}
                                    className="text-amber-600 font-bold hover:text-amber-700 transition-colors"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all"
                            >
                                {loading ? 'Đang đăng nhập...' : (
                                    <>
                                        Đăng Nhập <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : step === 'create-password' ? (
                        <form className="space-y-6" onSubmit={handleCreatePassword}>
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-5 mb-6 flex gap-3">
                                <div className="mt-0.5">
                                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 leading-snug">
                                    <span className="font-bold text-slate-900">Xác thực thành công!</span><br />Vui lòng tạo mật khẩu mới để hoàn tất.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Tạo mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-[3.5rem] pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg"
                                        placeholder="Ít nhất 6 ký tự"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <Lock className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-[3.5rem] pr-4 py-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg"
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all"
                            >
                                {loading ? 'Đang xử lý...' : (
                                    <>
                                        Hoàn Tất Đăng Ký <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : step === 'otp' ? (
                        <form className="space-y-8" onSubmit={handleVerifyOtp}>
                            <div className="text-center mb-6">
                                <p className="text-sm font-medium text-slate-500 mb-1">Mã xác thực đã gửi đến</p>
                                <p className="font-black text-2xl text-slate-900 tracking-tight">{phone}</p>
                                <div className="flex items-center justify-center gap-3 mt-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        Đổi SĐT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={resendCountdown > 0 || loading}
                                        className="text-xs font-bold bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors disabled:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                    >
                                        {resendCountdown > 0
                                            ? `Gửi lại sau ${resendCountdown}s`
                                            : 'Gửi lại mã'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 text-center">
                                    Nhập mã OTP (6 số)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                                            <KeyRound className="h-5 w-5 text-slate-400" />
                                        </div>
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength={6}
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="block w-full pl-[3.5rem] pr-4 py-4 border border-slate-300 rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition-all tracking-[0.5em] text-2xl font-black text-center text-slate-900"
                                        placeholder="••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all"
                            >
                                {loading ? 'Đang kiểm tra...' : (
                                    <>
                                        Xác Thực <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : null}

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-100" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-white text-slate-400 font-medium">
                                    Hỗ trợ tài xế
                                </span>
                            </div>
                        </div>

                        <div className="mt-6">
                            <a
                                href="tel:0912345678"
                                className="w-full inline-flex justify-center items-center py-4 px-4 border-2 border-slate-100 rounded-2xl bg-slate-50 hover:bg-white hover:border-amber-200 hover:shadow-md transition-all group"
                            >
                                <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                                    <Phone className="w-4 h-4" strokeWidth={2.5} />
                                </div>
                                <span className="text-[15px] font-bold text-slate-700 group-hover:text-amber-700">Gọi Hotline: <span className="text-lg">0912.345.678</span></span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

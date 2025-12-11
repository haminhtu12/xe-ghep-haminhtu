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
                    <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
                        <Car className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
                    Dành Cho Tài Xế
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    {step === 'create-password' ? 'Tạo mật khẩu để bảo mật tài khoản' : 'Đăng nhập nhanh bằng OTP hoặc Mật khẩu'}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
                <div className="bg-white py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-slate-100">

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

                    {/* Tab switcher for login method */}
                    {step === 'phone' && (
                        <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
                            <button
                                type="button"
                                onClick={() => setLoginMethod('otp')}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${loginMethod === 'otp'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Đăng nhập bằng OTP
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoginMethod('password');
                                    setStep('password');
                                }}
                                className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${loginMethod === 'password'
                                        ? 'bg-white text-slate-900 shadow-sm'
                                        : 'text-slate-600 hover:text-slate-900'
                                    }`}
                            >
                                Đăng nhập bằng Mật khẩu
                            </button>
                        </div>
                    )}

                    {step === 'phone' && loginMethod === 'otp' ? (
                        <form className="space-y-6" onSubmit={handleSendOtp}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Số điện thoại
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
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
                    ) : step === 'password' ? (
                        <form className="space-y-6" onSubmit={handleLoginWithPassword}>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Số điện thoại
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
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

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Mật khẩu
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <button
                                    type="button"
                                    onClick={() => setStep('phone')}
                                    className="text-amber-600 hover:underline"
                                >
                                    ← Quay lại
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoginMethod('otp');
                                        setStep('phone');
                                    }}
                                    className="text-amber-600 hover:underline"
                                >
                                    Đăng nhập bằng OTP
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 transition-all"
                            >
                                {loading ? 'Đang đăng nhập...' : (
                                    <>
                                        Đăng Nhập <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : step === 'create-password' ? (
                        <form className="space-y-6" onSubmit={handleCreatePassword}>
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-4">
                                <p className="text-sm text-slate-700">
                                    <span className="font-bold">Chúc mừng!</span> Tài khoản của bạn đã được xác thực. Vui lòng tạo mật khẩu để bảo mật tài khoản.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Tạo mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        placeholder="Ít nhất 6 ký tự"
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700">
                                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-xl focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                </div>
                                <p className="mt-2 text-xs text-slate-500">
                                    Mật khẩu phải có ít nhất 6 ký tự
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 transition-all"
                            >
                                {loading ? 'Đang xử lý...' : (
                                    <>
                                        Hoàn Tất Đăng Ký <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : step === 'otp' ? (
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
                                <label className="block text-sm font-medium text-slate-700">
                                    Nhập mã OTP (6 số)
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
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
                    ) : null}

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-slate-500">
                                    Hỗ trợ tài xế
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-3">
                            <a
                                href="tel:0912345678"
                                className="w-full inline-flex justify-center py-3 px-4 border border-slate-200 rounded-xl shadow-sm bg-white text-sm font-medium text-slate-500 hover:bg-slate-50"
                            >
                                <Phone className="w-5 h-5 text-slate-400 mr-2" />
                                Gọi Hotline: 0912.345.678
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

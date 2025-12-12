'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Phone, Lock, ArrowRight, Gift, KeyRound } from 'lucide-react';
import NotificationModal from '@/components/ui/notification-modal';

declare global {
    interface Window {
        recaptchaVerifier: any;
    }
}

interface NotificationState {
    isOpen: boolean;
    type: 'success' | 'error' | 'warning';
    title?: string;
    message: string;
}

export default function DriverLogin() {
    const [step, setStep] = useState<'phone' | 'otp' | 'password' | 'create-password'>('phone');
    const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [lastOtpSentTime, setLastOtpSentTime] = useState<number>(0);
    const [isNewDriver, setIsNewDriver] = useState(false);
    const [verifiedOtp, setVerifiedOtp] = useState('');
    const router = useRouter();
    const [confirmationResult, setConfirmationResult] = useState<any>(null);

    // Notification State
    const [notification, setNotification] = useState<NotificationState>({
        isOpen: false,
        type: 'success',
        message: ''
    });

    const closeNotification = () => {
        setNotification(prev => ({ ...prev, isOpen: false }));
    };

    const showNotification = (type: 'success' | 'error' | 'warning', message: string, title?: string) => {
        setNotification({
            isOpen: true,
            type,
            message,
            title
        });
    };

    // Initialize Recaptcha
    useEffect(() => {
        if (!window.recaptchaVerifier) {
            import('@/lib/firebase').then(({ auth, RecaptchaVerifier }) => {
                window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                    'size': 'invisible',
                    'callback': (response: any) => {
                        // reCAPTCHA solved, allow signInWithPhoneNumber.
                    }
                });
            });
        }
    }, []);

    // Countdown timer
    useEffect(() => {
        if (resendCountdown > 0) {
            const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCountdown]);

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length < 10) {
            showNotification('error', 'Vui lòng nhập số điện thoại hợp lệ.', 'Số điện thoại lỗi');
            return;
        }

        // Client-side rate limiting
        const now = Date.now();
        const MIN_RESEND_INTERVAL = 60000; // 60 seconds
        if (now - lastOtpSentTime < MIN_RESEND_INTERVAL && lastOtpSentTime > 0) {
            const waitTime = Math.ceil((MIN_RESEND_INTERVAL - (now - lastOtpSentTime)) / 1000);
            showNotification('warning', `Vui lòng đợi ${waitTime} giây trước khi gửi lại mã OTP.`, 'Gửi quá nhanh');
            return;
        }

        setLoading(true);

        try {
            // Import dynamically or assume loaded from useEffect
            const { auth, signInWithPhoneNumber } = await import('@/lib/firebase');

            // Format phone to +84 (Firebase requires E.164)
            const formattedPhone = phone.startsWith('0')
                ? '+84' + phone.slice(1)
                : phone.startsWith('+84') ? phone : '+84' + phone;

            // Check if test phone number (for development)
            const TEST_PHONES = ['+84912345678', '+84987654321'];
            if (TEST_PHONES.includes(formattedPhone)) {
                // Create a mock confirmation result for test phones
                const mockConfirmationResult = {
                    confirm: async (code: string) => {
                        if (code === '123456') {
                            return { user: { phoneNumber: formattedPhone } };
                        } else {
                            throw new Error('Invalid OTP');
                        }
                    }
                };

                setConfirmationResult(mockConfirmationResult);
                showNotification(
                    'success',
                    'Đây là số điện thoại test.\n\nSử dụng mã OTP: 123456',
                    '🧪 Test Mode'
                );
                setStep('otp');
                setResendCountdown(60);
                setLastOtpSentTime(now);
                setLoading(false);
                return;
            }

            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);

            setConfirmationResult(result);
            setStep('otp');
            setResendCountdown(60);
            setLastOtpSentTime(now);

            showNotification(
                'success',
                `Mã đăng ký đã được gửi đến số điện thoại\n${phone}.\nVui lòng kiểm tra tin nhắn.`,
                'Đã gửi mã xác thực'
            );

        } catch (error: any) {
            console.error('Firebase Send OTP error:', error);

            // Handle specific Firebase errors
            if (error.code === 'auth/too-many-requests') {
                showNotification(
                    'warning',
                    'Số điện thoại này đã nhận quá nhiều mã OTP trong ngày.\n\n' +
                    '⏰ Vui lòng thử lại sau 24 giờ\n' +
                    '📞 Hoặc liên hệ hotline: 0334.909.668',
                    '⚠️ Đã vượt giới hạn'
                );
            } else if (error.code === 'auth/invalid-phone-number') {
                showNotification(
                    'error',
                    'Số điện thoại không hợp lệ.\nVui lòng kiểm tra lại định dạng.\n\nVí dụ: 0912345678',
                    'Số điện thoại lỗi'
                );
            } else if (error.code === 'auth/quota-exceeded') {
                showNotification(
                    'warning',
                    'Hệ thống đang bảo trì.\n\nVui lòng liên hệ hotline: 0334.909.668',
                    'Tạm thời không khả dụng'
                );
            } else {
                showNotification(
                    'error',
                    'Không thể gửi SMS. Vui lòng thử lại sau.\n\nNếu vấn đề vẫn tiếp diễn, liên hệ: 0334.909.668',
                    'Gửi thất bại'
                );
            }

            // Reset recaptcha
            if (window.recaptchaVerifier) {
                window.recaptchaVerifier.clear();
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('🔍 Debug - confirmationResult:', confirmationResult);
            console.log('🔍 Debug - OTP entered:', otp);

            if (!confirmationResult) {
                console.error('❌ confirmationResult is null/undefined');
                showNotification('warning', 'Vui lòng yêu cầu gửi lại mã xác thực.', 'Phiên hết hạn');
                setStep('phone');
                return;
            }

            // 1. Verify OTP with Firebase
            await confirmationResult.confirm(otp);
            // User is now signed in with Firebase. 
            // We can get the ID token if needed: const idToken = await result.user.getIdToken();

            // 2. Call Backend to create session / check if new user
            const res = await fetch('/api/drivers/firebase-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    // We trust the call because it comes after Firebase success in this flow.
                    // Ideally send idToken here for backend verification.
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.needPassword) {
                    setIsNewDriver(true);
                    setStep('create-password');
                    setOtp('');
                    showNotification('success', data.message, 'Xác thực thành công');
                    return;
                }

                if (data.isNew) {
                    showNotification('success', data.message, 'Chào mừng!');
                } else {
                    showNotification('success', data.message, 'Đăng nhập thành công');
                }

                // Delay redirect slightly for user to see success message
                setTimeout(() => {
                    router.push('/tai-xe/dashboard');
                }, 1500);
            } else {
                showNotification('error', data.error || 'Đăng nhập server thất bại.', 'Lỗi đăng nhập');
            }

        } catch (error: any) {
            console.error('Verify OTP error:', error);
            showNotification('error', 'Mã OTP không đúng hoặc đã hết hạn.', 'Xác thực thất bại');
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
                showNotification('success', data.message, 'Đăng nhập thành công');
                setTimeout(() => {
                    router.push('/tai-xe/dashboard');
                }, 1000);
            } else {
                showNotification('error', data.error || 'Đăng nhập thất bại.', 'Lỗi');
            }
        } catch (error) {
            console.error('Login error:', error);
            showNotification('error', 'Có lỗi xảy ra khi kết nối server.', 'Lỗi kết nối');
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            showNotification('warning', 'Mật khẩu xác nhận không khớp!', 'Lỗi mật khẩu');
            return;
        }
        if (password.length < 6) {
            showNotification('warning', 'Mật khẩu phải có ít nhất 6 ký tự', 'Mật khẩu quá ngắn');
            return;
        }
        setLoading(true);

        try {
            // Call the same endpoint but with password
            const res = await fetch('/api/drivers/firebase-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    password,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                showNotification('success', data.message, 'Tạo tài khoản thành công');
                setTimeout(() => {
                    router.push('/tai-xe/dashboard');
                }, 1500);
            } else {
                showNotification('error', data.error || 'Lỗi tạo tài khoản.', 'Lỗi chi tiết');
            }
        } catch (error) {
            console.error('Create password error:', error);
            showNotification('error', 'Có lỗi xảy ra khi tạo mật khẩu.', 'Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <NotificationModal
                isOpen={notification.isOpen}
                onClose={closeNotification}
                type={notification.type}
                title={notification.title}
                message={notification.message}
            />

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

                    {/* Tab switcher - Always visible unless in OTP verification or Create Password step */}
                    {['phone', 'password'].includes(step) && (
                        <div className="flex gap-6 mb-10">
                            <button
                                type="button"
                                onClick={() => {
                                    setLoginMethod('otp');
                                    setStep('phone');
                                }}
                                className={`flex-1 py-4 px-4 rounded-xl text-[15px] font-bold transition-all duration-200 border-b-2 text-center relative ${loginMethod === 'otp'
                                    ? 'bg-amber-50 text-amber-700 border-amber-500 shadow-sm'
                                    : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100 hover:text-slate-600'
                                    }`}
                            >
                                Đăng nhập OTP
                                {loginMethod === 'otp' && (
                                    <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500 rotate-45 border-r border-b border-amber-50 hidden"></div>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setLoginMethod('password');
                                    setStep('password');
                                }}
                                className={`flex-1 py-4 px-4 rounded-xl text-[15px] font-bold transition-all duration-200 border-b-2 text-center ${loginMethod === 'password'
                                    ? 'bg-amber-50 text-amber-700 border-amber-500 shadow-sm'
                                    : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100 hover:text-slate-600'
                                    }`}
                            >
                                Mật khẩu
                            </button>
                        </div>
                    )}

                    {step === 'phone' ? (
                        <form className="space-y-8" onSubmit={handleSendOtp}>
                            <div id="recaptcha-container"></div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Số điện thoại
                                </label>
                                <div className="relative">
                                    <div className="flex items-center gap-0 border border-slate-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all">
                                        <div className="flex-shrink-0 w-14 h-14 bg-slate-100 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="flex-1 px-4 py-4 border-0 focus:ring-0 focus:outline-none font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg bg-transparent"
                                            placeholder="0912 xxx xxx"
                                            style={{ lineHeight: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all h-[56px]"
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
                                    <div className="flex items-center gap-0 border border-slate-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all">
                                        <div className="flex-shrink-0 w-14 h-14 bg-slate-100 flex items-center justify-center">
                                            <Phone className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="tel"
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="flex-1 px-4 py-4 border-0 focus:ring-0 focus:outline-none font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg bg-transparent"
                                            placeholder="0912 xxx xxx"
                                            style={{ lineHeight: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="flex items-center gap-0 border border-slate-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all">
                                        <div className="flex-shrink-0 w-14 h-14 bg-slate-100 flex items-center justify-center">
                                            <Lock className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-1 px-4 py-4 border-0 focus:ring-0 focus:outline-none font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg bg-transparent"
                                            placeholder="••••••••"
                                            style={{ lineHeight: '100%' }}
                                        />
                                    </div>
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
                                className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all h-[56px]"
                            >
                                {loading ? 'Đang đăng nhập...' : (
                                    <>
                                        Đăng Nhập Ngay <ArrowRight className="w-6 h-6" />
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
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Tạo mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="flex items-center gap-0 border border-slate-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all">
                                        <div className="flex-shrink-0 w-14 h-14 bg-slate-100 flex items-center justify-center">
                                            <Lock className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="flex-1 px-4 py-4 border-0 focus:ring-0 focus:outline-none font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg bg-transparent"
                                            placeholder="Ít nhất 6 ký tự"
                                            minLength={6}
                                            style={{ lineHeight: '100%' }}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                    Xác nhận mật khẩu <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="flex items-center gap-0 border border-slate-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all">
                                        <div className="flex-shrink-0 w-14 h-14 bg-slate-100 flex items-center justify-center">
                                            <Lock className="h-5 w-5 text-slate-500" />
                                        </div>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="flex-1 px-4 py-4 border-0 focus:ring-0 focus:outline-none font-bold text-slate-900 placeholder:font-normal placeholder:text-slate-400 text-lg bg-transparent"
                                            placeholder="Nhập lại mật khẩu"
                                            style={{ lineHeight: '100%' }}
                                        />
                                    </div>
                                </div>
                                <p className="mt-2 text-xs text-slate-500 ml-1">
                                    Mật khẩu phải có ít nhất 6 ký tự
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg h-[56px] text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 transition-all"
                            >
                                {loading ? 'Đang xử lý...' : (
                                    <>
                                        Hoàn Tất Đăng Ký <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : step === 'otp' ? (
                        <form className="space-y-8" onSubmit={handleVerifyOtp}>
                            <div className="text-center mb-8">
                                <p className="text-sm font-medium text-slate-500 mb-1">Mã xác thực đã gửi đến</p>
                                <p className="font-black text-2xl text-slate-900 tracking-tight">{phone}</p>
                                <div className="flex items-center justify-center gap-3 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => setStep('phone')}
                                        className="text-xs font-bold bg-slate-100 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                                    >
                                        Đổi SĐT
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={resendCountdown > 0 || loading}
                                        className="text-xs font-bold bg-amber-50 text-amber-600 px-4 py-2 rounded-lg hover:bg-amber-100 transition-colors disabled:text-slate-400 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                    >
                                        {resendCountdown > 0
                                            ? `Gửi lại sau ${resendCountdown}s`
                                            : 'Gửi lại mã'}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-3 text-center">
                                    Nhập mã OTP (6 số)
                                </label>
                                <div className="mx-auto">
                                    <div className="flex items-center gap-0 border border-slate-300 rounded-xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all bg-white relative">
                                        <div className="flex-shrink-0 w-14 h-14 bg-slate-50 flex items-center justify-center border-r border-slate-100">
                                            <KeyRound className="h-5 w-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            pattern="[0-9]*"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            required
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => {
                                                // Only allow numbers
                                                const val = e.target.value.replace(/\D/g, '');
                                                if (val.length <= 6) setOtp(val);
                                            }}
                                            className="flex-1 px-2 h-14 border-0 focus:ring-0 focus:outline-none text-[22px] font-bold text-center text-slate-800 bg-transparent tracking-[0.5em] placeholder:tracking-normal w-full"
                                            placeholder="------"
                                        />
                                    </div>
                                    <p className="text-center text-xs text-slate-400 mt-2 font-medium">Nhập 6 số trong tin nhắn SMS</p>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg mt-8 h-[56px] text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 transition-all"
                            >
                                {loading ? 'Đang kiểm tra...' : (
                                    <>
                                        Đăng Nhập <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : null}

                    {/* Hotline Section - Improve alignment and styling */}
                    <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center justify-center text-center">
                        <span className="text-slate-400 text-xs font-medium mb-2 uppercase tracking-wider">Hỗ trợ tài xế 24/7</span>
                        <a href="tel:0334909668" className="group flex items-center gap-3 bg-slate-50 hover:bg-amber-50 px-5 py-3 rounded-xl transition-all border border-slate-100 hover:border-amber-200 shadow-sm hover:shadow-md">
                            <div className="bg-amber-100 text-amber-600 p-2 rounded-full group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                <Phone className="w-5 h-5 fill-current" />
                            </div>
                            <span className="font-bold text-slate-700 text-lg group-hover:text-amber-700 transition-colors">
                                0334.909.668
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

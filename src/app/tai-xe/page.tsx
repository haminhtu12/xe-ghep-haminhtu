'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Car, CheckCircle, DollarSign, Clock, Users, Phone, Gift, KeyRound, ArrowRight } from 'lucide-react';
import Link from 'next/link';
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
    actions?: Array<{
        label: string;
        onClick: () => void;
        variant?: 'primary' | 'secondary' | 'text';
    }>;
}

export default function DriverRegistration() {
    const [step, setStep] = useState<'phone' | 'otp' | 'password'>('phone');
    const [loginMethod, setLoginMethod] = useState<'otp' | 'password'>('otp');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(0);
    const [lastOtpSentTime, setLastOtpSentTime] = useState<number>(0);
    const [confirmationResult, setConfirmationResult] = useState<any>(null);
    const router = useRouter();

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
        const initRecaptcha = async () => {
            if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
                try {
                    const { auth, RecaptchaVerifier } = await import('@/lib/firebase');
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        'size': 'invisible',
                        'callback': (response: any) => {
                            // reCAPTCHA solved
                            console.log('reCAPTCHA solved');
                        },
                        'expired-callback': () => {
                            // Reset when expired
                            console.log('reCAPTCHA expired, resetting...');
                            if (window.recaptchaVerifier) {
                                window.recaptchaVerifier.clear();
                                window.recaptchaVerifier = undefined;
                            }
                        }
                    });
                } catch (error) {
                    console.error('Failed to initialize reCAPTCHA:', error);
                }
            }
        };

        initRecaptcha();

        return () => {
            // Cleanup on unmount
            if (window.recaptchaVerifier) {
                try {
                    window.recaptchaVerifier.clear();
                } catch (e) {
                    console.log('reCAPTCHA already cleared');
                }
                window.recaptchaVerifier = undefined;
            }
        };
    }, []);


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
            // Format phone to +84 (Firebase requires E.164)
            const formattedPhone = phone.startsWith('0')
                ? '+84' + phone.slice(1)
                : phone.startsWith('+84') ? phone : '+84' + phone;

            // Check if phone already exists in database
            const checkRes = await fetch('/api/drivers/check-phone', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone: formattedPhone }),
            });
            const { exists } = await checkRes.json();

            if (exists) {
                setLoading(false);
                setNotification({
                    isOpen: true,
                    type: 'warning',
                    title: 'Tài khoản đã tồn tại',
                    message: 'Số điện thoại này đã đăng ký.',
                    actions: [
                        {
                            label: '🔑 Đăng nhập bằng mật khẩu',
                            onClick: () => {
                                setLoginMethod('password');
                                setStep('password');
                            },
                            variant: 'primary'
                        },
                        {
                            label: 'Quên mật khẩu?',
                            onClick: () => {
                                // Allow OTP for password reset - just close modal
                                // User can try again and we won't block
                            },
                            variant: 'text'
                        }
                    ]
                });
                return;
            }


            // Import Firebase
            const { auth, signInWithPhoneNumber } = await import('@/lib/firebase');

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

            // Reset recaptcha properly
            if (window.recaptchaVerifier) {
                try {
                    await window.recaptchaVerifier.clear();
                    window.recaptchaVerifier = undefined;

                    // Reinitialize for next attempt
                    const { auth, RecaptchaVerifier } = await import('@/lib/firebase');
                    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                        'size': 'invisible',
                        'callback': (response: any) => {
                            console.log('reCAPTCHA solved');
                        }
                    });
                } catch (e) {
                    console.error('Failed to reset reCAPTCHA:', e);
                }
            }
        } finally {
            setLoading(false);
        }

    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirmationResult) {
            showNotification('error', 'Vui lòng gửi mã OTP trước.', 'Lỗi xác thực');
            return;
        }
        setLoading(true);

        try {
            // 1. Verify OTP with Firebase
            await confirmationResult.confirm(otp);
            // User is now signed in with Firebase

            // 2. Call Backend to create session / check if new user
            const res = await fetch('/api/drivers/firebase-login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phone,
                    // We trust the call because it comes after Firebase success
                }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.needPassword) {
                    // New user needs to create password - redirect to login page
                    showNotification('success', data.message, 'Xác thực thành công');
                    setTimeout(() => {
                        router.push('/tai-xe/login');
                    }, 1500);
                    return;
                }

                if (data.isNew) {
                    showNotification('success', `🎉 ${data.message}`, 'Chào mừng!');
                } else {
                    showNotification('success', data.message, 'Đăng nhập thành công');
                }
                setTimeout(() => {
                    router.push('/tai-xe/dashboard');
                }, 1500);
            } else {
                showNotification('error', data.error || 'Xác thực thất bại. Vui lòng thử lại.', 'Lỗi');
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

    return (
        <main className="min-h-screen bg-slate-50">
            <NotificationModal
                isOpen={notification.isOpen}
                onClose={closeNotification}
                type={notification.type}
                title={notification.title}
                message={notification.message}
                actions={notification.actions}
            />
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
                        Bạn chỉ việc nhận cuốc và chạy, không ràng buộc.
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
                        <p className="text-slate-500 mb-2 text-center">
                            Chỉ cần 30 giây. <span className="font-bold text-amber-600">Tặng ngay 150.000đ</span>
                        </p>
                        <p className="text-sm text-slate-400 mb-6 text-center">
                            👋 Lần đầu? Nhập số điện thoại để nhận mã xác thực
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

                        {/* Tab switcher - Only show for phone/password steps */}
                        {['phone', 'password'].includes(step) && (
                            <div className="flex gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoginMethod('otp');
                                        setStep('phone');
                                    }}
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 border-b-2 text-center ${loginMethod === 'otp'
                                        ? 'bg-amber-50 text-amber-700 border-amber-500 shadow-sm'
                                        : 'bg-slate-50 text-slate-400 border-transparent hover:bg-slate-100 hover:text-slate-600'
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
                                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 border-b-2 text-center ${loginMethod === 'password'
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
                                <div className="w-full">
                                    <label className="block text-sm font-bold text-slate-700 mb-4 ml-1">
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
                                    className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all"
                                >
                                    {loading ? 'Đang gửi...' : (
                                        <>
                                            Lấy Mã Xác Thực <ArrowRight className="w-6 h-6" />
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

                                <div className="w-full">
                                    <label className="block text-sm font-bold text-slate-700 mb-3 text-center">
                                        Nhập mã OTP (6 số)
                                    </label>
                                    <div className="flex items-center gap-0 border border-slate-300 rounded-2xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all bg-white">
                                        <div className="flex-shrink-0 w-16 h-16 bg-slate-50 flex items-center justify-center border-r-2 border-slate-200">
                                            <KeyRound className="h-6 w-6 text-slate-400" />
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
                                            className="flex-1 px-4 h-16 border-0 focus:ring-0 focus:outline-none text-2xl font-black text-center text-slate-800 bg-transparent tracking-[0.5em] placeholder:tracking-normal w-full"
                                            placeholder="------"
                                        />
                                    </div>
                                    <p className="text-center text-xs text-slate-400 mt-2 font-medium">Nhập 6 số trong tin nhắn SMS</p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all"
                                >
                                    {loading ? 'Đang kiểm tra...' : (
                                        <>
                                            Đăng Nhập <ArrowRight className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : step === 'password' ? (
                            <form className="space-y-8" onSubmit={handleLoginWithPassword}>
                                <div className="space-y-6">
                                    <div className="w-full">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                                            Số điện thoại
                                        </label>
                                        <div className="relative">
                                            <div className="flex items-center gap-0 border border-slate-300 rounded-2xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all">
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

                                    <div className="w-full">
                                        <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
                                            Mật khẩu
                                        </label>
                                        <div className="relative">
                                            <div className="flex items-center gap-0 border border-slate-300 rounded-2xl shadow-sm overflow-hidden focus-within:ring-4 focus-within:ring-amber-500/10 focus-within:border-amber-500 transition-all">
                                                <div className="flex-shrink-0 w-14 h-14 bg-slate-100 flex items-center justify-center">
                                                    <KeyRound className="h-5 w-5 text-slate-500" />
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
                                </div>

                                <div className="flex items-center justify-between text-sm px-1">
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
                                    className="w-full flex justify-center items-center gap-3 py-4 px-4 border border-transparent rounded-2xl shadow-xl shadow-amber-500/20 text-lg font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 active:scale-[0.98] transition-all h-[56px]"
                                >
                                    {loading ? 'Đang đăng nhập...' : (
                                        <>
                                            Đăng Nhập <ArrowRight className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </form>
                        ) : null}


                        <p className="mt-8 text-sm text-slate-400 text-center font-medium">
                            Đã có hơn <span className="text-amber-500 font-bold">500+ tài xế</span> tham gia tuần này
                        </p>
                    </div>
                </div>
            </div>
        </main >
    );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, MapPin, Bell, LogOut, ChevronRight, History, PlusCircle, Gift, Phone, User, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function DriverDashboard() {
    const [driver, setDriver] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<'hanoi' | 'thanhhoa'>('hanoi');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchDriver();
        const interval = setInterval(fetchBookings, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (driver) {
            fetchBookings();
        }
    }, [driver, location]);

    const fetchDriver = async () => {
        try {
            const res = await fetch('/api/drivers/me');
            if (res.ok) {
                const data = await res.json();
                setDriver(data.driver);
                setLocation(data.driver.current_location === 'thanhhoa' ? 'thanhhoa' : 'hanoi');
            } else {
                router.push('/tai-xe/login');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchBookings = async () => {
        try {
            const res = await fetch(`/api/bookings/available?location=${location}`);
            if (res.ok) {
                const data = await res.json();
                // Merge new data with existing accepted bookings to keep them visible
                setBookings(prev => {
                    const acceptedBookings = prev.filter(b => b.is_accepted);
                    const newBookings = data.bookings || [];
                    // Filter out duplicates if any
                    const uniqueNewBookings = newBookings.filter((nb: any) => !acceptedBookings.find(ab => ab.id === nb.id));
                    return [...acceptedBookings, ...uniqueNewBookings];
                });
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleAcceptBooking = async (bookingId: string) => {
        if (!confirm('Bạn có chắc chắn muốn nhận chuyến này? Phí nhận chuyến là 25.000đ.')) return;

        setProcessingId(bookingId);
        try {
            const res = await fetch('/api/bookings/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId }),
            });

            const data = await res.json();

            if (res.ok) {
                // Update local state to show full phone and call button
                setBookings(prev => prev.map(b => {
                    if (b.id === bookingId) {
                        return {
                            ...b,
                            phone: data.booking.phone,
                            full_phone_hidden: false,
                            is_accepted: true
                        };
                    }
                    return b;
                }));

                // Refresh driver balance
                fetchDriver();
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            alert('Lỗi kết nối');
        } finally {
            setProcessingId(null);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const now = new Date();
        const created = new Date(dateString);
        const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Vừa xong';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút trước`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
        return '1 ngày trước';
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Đang tải...</div>;

    if (!driver) return null;

    return (
        <div className="min-h-screen bg-slate-100 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-[60px] opacity-20 -mr-10 -mt-10"></div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <p className="text-slate-400 text-sm">Xin chào,</p>
                        <h1 className="text-2xl font-bold">{driver.name}</h1>
                        <p className="text-sm text-slate-400 mt-1">{driver.phone}</p>
                    </div>
                    <button className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors relative">
                        <Bell className="w-6 h-6 text-white" />
                        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900"></span>
                    </button>
                </div>

                {/* Wallet Card */}
                <div className="mt-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-4 shadow-lg shadow-amber-500/20 text-white">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-amber-100 text-sm font-medium flex items-center gap-2">
                            <Wallet className="w-4 h-4" /> Số dư ví
                        </span>
                        <span className="bg-white/20 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm">
                            Đã xác thực
                        </span>
                    </div>
                    <div className="text-3xl font-bold">
                        {driver.wallet_balance.toLocaleString('vi-VN')}đ
                    </div>
                    <div className="mt-4">
                        <button
                            onClick={() => setShowTopUpModal(true)}
                            className="w-full bg-white text-amber-700 hover:bg-amber-50 py-3 rounded-xl text-base font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Nạp tiền vào ví
                        </button>
                    </div>
                </div>
            </div>

            <div className="px-4 -mt-4 relative z-10 space-y-4">

                {/* Location Toggle */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-base font-bold text-slate-700 uppercase mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-amber-500" />
                        Vị trí hiện tại của bạn
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setLocation('hanoi')}
                            className={`py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${location === 'hanoi'
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-500 ring-offset-2'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            <MapPin className={`w-5 h-5 ${location === 'hanoi' ? 'text-white' : 'text-slate-400'}`} />
                            Hà Nội
                        </button>
                        <button
                            onClick={() => setLocation('thanhhoa')}
                            className={`py-4 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2 ${location === 'thanhhoa'
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30 ring-2 ring-amber-500 ring-offset-2'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            <MapPin className={`w-5 h-5 ${location === 'thanhhoa' ? 'text-white' : 'text-slate-400'}`} />
                            Thanh Hóa
                        </button>
                    </div>
                </div>

                {/* Main Actions */}
                <div className="grid grid-cols-1 gap-4">
                    <button className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:border-amber-500 transition-colors group">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <History className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="font-bold text-slate-800">Lịch Sử Chuyến Đi</span>
                    </button>
                </div>

                {/* AVAILABLE BOOKINGS LIST */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            Khách đang tìm xe ({bookings.length})
                        </h3>
                        <span className="text-xs text-slate-500">Tự động cập nhật</span>
                    </div>

                    {bookings.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl text-center border border-slate-100 border-dashed">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Clock className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-medium">Chưa có khách nào ở khu vực này.</p>
                            <p className="text-xs text-slate-400 mt-1">Hệ thống sẽ báo ngay khi có khách mới.</p>
                        </div>
                    ) : (
                        bookings.map((booking) => (
                            <div key={booking.id} className={`bg-white p-5 rounded-2xl shadow-sm border transition-all relative overflow-hidden ${booking.is_accepted ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-100 hover:border-amber-500'}`}>
                                {booking.full_phone_hidden && (
                                    <div className="absolute top-0 right-0 bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {getTimeAgo(booking.created_at)}
                                    </div>
                                )}

                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-800">{booking.name}</h4>
                                        <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                            <Phone className="w-3 h-3" />
                                            <span className={`font-mono px-1 rounded ${booking.is_accepted ? 'bg-green-100 text-green-700 font-bold' : 'bg-slate-100'}`}>
                                                {booking.phone}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-amber-600 text-lg">
                                            {booking.estimated_price?.toLocaleString('vi-VN')}đ
                                        </div>
                                        <div className="text-xs text-slate-400">{booking.seat_count} ghế</div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-4">
                                    <div className="flex gap-3">
                                        <div className="flex flex-col items-center mt-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <div className="w-0.5 h-full bg-slate-200 my-1"></div>
                                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <p className="text-xs text-slate-400">Điểm đón</p>
                                                <p className="text-sm font-medium text-slate-700 line-clamp-1">{booking.pickup_address}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">Điểm trả</p>
                                                <p className="text-sm font-medium text-slate-700 line-clamp-1">{booking.dropoff_address || 'Chưa xác định'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.note && (
                                        <div className="bg-slate-50 p-2 rounded-lg text-xs text-slate-600 italic">
                                            "{booking.note}"
                                        </div>
                                    )}
                                </div>

                                {booking.is_accepted ? (
                                    <a
                                        href={`tel:${booking.phone}`}
                                        className="w-full bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-700 active:scale-95 transition-all flex items-center justify-center gap-2 animate-bounce"
                                    >
                                        <Phone className="w-5 h-5" /> GỌI KHÁCH NGAY
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => handleAcceptBooking(booking.id)}
                                        disabled={processingId === booking.id}
                                        className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                    >
                                        {processingId === booking.id ? (
                                            'Đang xử lý...'
                                        ) : (
                                            <>
                                                Nhận Chuyến (Phí 25k) <CheckCircle className="w-4 h-4" />
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <button
                    onClick={() => router.push('/api/auth/logout')}
                    className="w-full py-4 text-slate-400 font-medium flex items-center justify-center gap-2 hover:text-red-500 transition-colors mt-8"
                >
                    <LogOut className="w-5 h-5" /> Đăng xuất
                </button>
            </div>

            {/* Top Up Modal */}
            {showTopUpModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 relative">
                        <button
                            onClick={() => setShowTopUpModal(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10"
                        >
                            <XCircle className="w-8 h-8 text-slate-400 hover:text-slate-600" />
                        </button>

                        <div className="text-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Nạp tiền vào ví</h3>
                            <p className="text-slate-500 text-sm mt-1">Quét mã QR để chuyển khoản</p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                            <img
                                src="/images/qr-payment.png"
                                alt="QR Payment"
                                className="w-full h-auto rounded-xl mix-blend-multiply"
                            />
                        </div>

                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-slate-500 text-sm">Ngân hàng</span>
                                <span className="font-bold text-slate-800">Techcombank</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-slate-500 text-sm">Số tài khoản</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-800 tracking-wider">1903 4037 9940 17</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                <span className="text-slate-500 text-sm">Chủ tài khoản</span>
                                <span className="font-bold text-slate-800 uppercase">HA MINH TU</span>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                                <p className="text-xs text-amber-600 mb-1 font-semibold uppercase">Nội dung chuyển khoản</p>
                                <p className="text-lg font-bold text-amber-700 font-mono">NAP {driver.phone}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowTopUpModal(false);
                                alert('Hệ thống đã ghi nhận yêu cầu. Vui lòng chờ 5-10 phút để tiền vào ví.');
                            }}
                            className="w-full bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-green-600 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Tôi đã chuyển khoản
                        </button>

                        <button
                            onClick={() => setShowTopUpModal(false)}
                            className="w-full mt-3 bg-slate-100 text-slate-600 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
                        >
                            Đóng lại
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

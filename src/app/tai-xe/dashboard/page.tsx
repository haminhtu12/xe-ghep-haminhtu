'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, MapPin, Bell, LogOut, ChevronRight, History, PlusCircle, Gift, Phone, User, Clock, CheckCircle, XCircle, Home, Car } from 'lucide-react';

export default function DriverDashboard() {
    const [driver, setDriver] = useState<any>(null);
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState<'hanoi' | 'thanhhoa'>('hanoi');
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showTopUpModal, setShowTopUpModal] = useState(false);
    const [successBooking, setSuccessBooking] = useState<any>(null);
    const [confirmBooking, setConfirmBooking] = useState<{ id: string, serviceType: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'find' | 'my-bookings'>('find');
    const [myBookings, setMyBookings] = useState<any[]>([]);
    const router = useRouter();

    // Initial load
    useEffect(() => {
        fetchDriver();
    }, []);

    // Poll bookings with current location
    useEffect(() => {
        const interval = setInterval(() => {
            console.log(`[POLLING] Fetching for ${location}`);
            fetchBookings();
        }, 10000); // Poll every 10s

        return () => clearInterval(interval);
    }, [location]); // Re-create interval when location changes to capture new state

    useEffect(() => {
        if (driver) {
            fetchBookings();
            if (activeTab === 'my-bookings') {
                fetchMyBookings();
            }
        }
    }, [driver, location, activeTab]);

    const fetchMyBookings = async () => {
        try {
            const res = await fetch('/api/bookings/my-bookings');
            if (res.ok) {
                const data = await res.json();
                setMyBookings(data.bookings || []);
            }
        } catch (error) {
            console.error('Error fetching my bookings:', error);
        }
    };

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
                // Only show pending bookings (not accepted by anyone yet)
                setBookings(data.bookings || []);
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleLocationChange = async (newLocation: 'hanoi' | 'thanhhoa') => {
        try {
            // Update database first to persist the change
            const res = await fetch('/api/drivers/update-location', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_location: newLocation }),
            });

            if (res.ok) {
                // Then update local state
                setLocation(newLocation);
            } else {
                alert('Không thể cập nhật vị trí. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Update location error:', error);
            alert('Lỗi kết nối. Vui lòng thử lại.');
        }
    };

    const handleAcceptBooking = (bookingId: string, serviceType: string) => {
        setConfirmBooking({ id: bookingId, serviceType });
    };

    const performAcceptBooking = async () => {
        if (!confirmBooking) return;
        const { id: bookingId } = confirmBooking;
        setConfirmBooking(null); // Close confirm modal

        setProcessingId(bookingId);
        try {
            const res = await fetch('/api/bookings/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId }),
            });

            const data = await res.json();

            if (res.ok) {
                // Show success modal with booking details
                setSuccessBooking(data.booking);

                // Remove the accepted booking from the list immediately
                setBookings(prev => prev.filter(b => b.id !== bookingId));

                // Refresh driver balance
                fetchDriver();

                // Refresh bookings list to get latest data
                fetchBookings();
                // Refresh my bookings as well
                fetchMyBookings();
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
        <div className="min-h-screen bg-slate-50 pb-28 font-sans text-slate-900">
            {/* Header - Reduced height and lighter feel */}
            <div className="bg-slate-900 text-white p-5 pb-8 rounded-b-3xl shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500 rounded-full blur-[90px] opacity-15 -mr-10 -mt-10 animate-pulse"></div>

                <div className="flex justify-between items-start relative z-10 mb-6">
                    <div>
                        <p className="text-slate-400 text-sm font-medium mb-1">Xin chào tài xế,</p>
                        <h1 className="text-xl font-bold tracking-tight">{driver.name}</h1>
                        <div className="flex items-center gap-1 text-slate-400 mt-1 bg-slate-800/50 px-2 py-0.5 rounded-full w-fit border border-slate-700/30">
                            <Phone className="w-3 h-3" />
                            <span className="text-xs font-mono">{driver.phone}</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <a
                            href="/"
                            className="p-3 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors border border-slate-700/50 active:scale-95"
                        >
                            <Home className="w-5 h-5 text-slate-300" />
                        </a>
                        <a
                            href="/api/drivers/logout"
                            className="p-3 bg-red-500/10 rounded-full hover:bg-red-500/20 transition-colors border border-red-500/20 active:scale-95"
                        >
                            <LogOut className="w-5 h-5 text-red-400" />
                        </a>
                    </div>
                </div>

                {/* Wallet Card - Improved Gradient and "Verified" Badge */}
                <div className="bg-gradient-to-br from-amber-400 to-orange-600 rounded-[1.5rem] p-5 shadow-xl shadow-orange-500/20 text-white relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>

                    <div className="flex justify-between items-center mb-3 relative z-10">
                        <span className="text-amber-50 text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                            <Wallet className="w-4 h-4" /> Số dư khả dụng
                        </span>
                        <span className="bg-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-md border border-white/20 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            ĐÃ XÁC THỰC
                        </span>
                    </div>
                    <div className="text-[2.5rem] font-extrabold mb-5 relative z-10 tracking-tight leading-none">
                        {driver.wallet_balance.toLocaleString('vi-VN')}
                        <span className="text-xl align-top ml-1 opacity-90 font-medium">đ</span>
                    </div>
                    <button
                        onClick={() => setShowTopUpModal(true)}
                        className="w-full bg-white text-orange-700 hover:bg-amber-50 py-3.5 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 relative z-10 group"
                    >
                        <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Nạp tiền ngay
                    </button>
                </div>
            </div>

            <div className="px-4 -mt-4 relative z-10 space-y-6">

                {/* Main Tab Switcher - More Distinct */}
                <div className="bg-white p-1.5 rounded-2xl shadow-lg shadow-slate-200/50 flex border border-slate-100">
                    <button
                        onClick={() => setActiveTab('find')}
                        className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 ${activeTab === 'find' ? 'bg-amber-500 text-white shadow-md transform scale-[1.02]' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
                    >
                        <MapPin className={activeTab === 'find' ? 'text-white' : 'text-slate-400'} size={20} />
                        Tìm Khách
                    </button>
                    <div className="w-px bg-slate-100 my-2 mx-1"></div>
                    <button
                        onClick={() => setActiveTab('my-bookings')}
                        className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2.5 ${activeTab === 'my-bookings' ? 'bg-emerald-600 text-white shadow-md transform scale-[1.02]' : 'text-slate-500 hover:bg-slate-50 border border-transparent'}`}
                    >
                        <CheckCircle className={activeTab === 'my-bookings' ? 'text-white' : 'text-slate-400'} size={20} />
                        Chuyến Của Tôi
                    </button>
                </div>

                {activeTab === 'find' ? (
                    <>
                        {/* Location Toggle - Better Contrast */}
                        <div className="bg-white p-5 rounded-[1.5rem] shadow-sm border border-slate-100">
                            <p className="text-sm font-bold text-slate-500 uppercase mb-4 flex items-center gap-2 tracking-wide pl-1">
                                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                                Khu vực hoạt động
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleLocationChange('hanoi')}
                                    className={`py-4 px-2 rounded-2xl font-bold text-sm transition-all duration-300 flex flex-col items-center gap-2 border ${location === 'hanoi'
                                        ? 'border-amber-500 bg-amber-50/50 text-amber-700 shadow-inner'
                                        : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50 shadow-sm'
                                        }`}
                                >
                                    <MapPin className={`w-6 h-6 ${location === 'hanoi' ? 'text-amber-600 scale-110 drop-shadow-sm' : 'text-slate-300'} transition-transform`} />
                                    Hà Nội
                                </button>
                                <button
                                    onClick={() => handleLocationChange('thanhhoa')}
                                    className={`py-4 px-2 rounded-2xl font-bold text-sm transition-all duration-300 flex flex-col items-center gap-2 border ${location === 'thanhhoa'
                                        ? 'border-amber-500 bg-amber-50/50 text-amber-700 shadow-inner'
                                        : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50 shadow-sm'
                                        }`}
                                >
                                    <MapPin className={`w-6 h-6 ${location === 'thanhhoa' ? 'text-amber-600 scale-110 drop-shadow-sm' : 'text-slate-300'} transition-transform`} />
                                    Thanh Hóa
                                </button>
                            </div>
                        </div>

                        {/* AVAILABLE BOOKINGS LIST - Improved Spacing & Cards */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2 pt-2">
                                <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-3">
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                    </div>
                                    Khách mới <span className="text-slate-400 font-normal text-sm">({bookings.length})</span>
                                </h3>

                            </div>

                            {bookings.length === 0 ? (
                                <div className="bg-white p-10 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                        <Clock className="w-10 h-10 text-slate-300" />
                                    </div>
                                    <p className="text-slate-900 font-bold mb-1 text-lg">Đang tìm khách...</p>
                                    <p className="text-sm text-slate-500">Khu vực {location === 'hanoi' ? 'Hà Nội' : 'Thanh Hóa'} hiện chưa có khách.</p>
                                </div>
                            ) : (
                                bookings.map((booking) => (
                                    <div key={booking.id} className="bg-white p-6 rounded-[1.5rem] shadow-[0_4px_20px_-8px_rgba(0,0,0,0.1)] border border-slate-100/50 hover:border-amber-200 transition-all duration-300 group">

                                        {/* Name & Price Header - More Spacing */}
                                        <div className="flex justify-between items-start mb-5 pb-5 border-b border-slate-50">
                                            <div className="flex-1 min-w-0 pr-4">
                                                <h4 className="font-extrabold text-[1.1rem] text-slate-900 truncate leading-tight">{booking.name}</h4>
                                                <div className="flex flex-wrap items-center gap-2 mt-2">
                                                    <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 text-[11px] font-bold px-2.5 py-1 rounded-lg font-mono tracking-wide">
                                                        <Phone size={12} /> {booking.phone}
                                                    </span>
                                                    <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1 rounded-lg">
                                                        <User size={12} /> {booking.seat_count} ghế
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-black text-amber-600 textxl leading-none tracking-tight">
                                                    {booking.estimated_price?.toLocaleString('vi-VN')}
                                                    <span className="text-xs align-top ml-0.5">đ</span>
                                                </div>
                                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1 block">Giá dự kiến</span>
                                            </div>
                                        </div>

                                        {/* Route Info - Clamp Lines */}
                                        <div className="mb-6 relative pl-3">
                                            {/* Connector Line */}
                                            <div className="absolute left-[13px] top-2.5 bottom-4 w-0.5 bg-slate-100"></div>

                                            <div className="flex gap-4 mb-5 relative z-10 group/item">
                                                <div className="mt-0.5 shrink-0">
                                                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm group-hover/item:scale-110 transition-transform">
                                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Điểm đón</p>
                                                    <p className="text-[15px] font-medium text-slate-800 leading-snug line-clamp-2" title={booking.pickup_address}>
                                                        {booking.pickup_address}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-4 relative z-10 group/item">
                                                <div className="mt-0.5 shrink-0">
                                                    <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm group-hover/item:scale-110 transition-transform">
                                                        <div className="w-2.5 h-2.5 bg-orange-600 rounded-full"></div>
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Điểm trả</p>
                                                    <p className="text-[15px] font-medium text-slate-800 leading-snug line-clamp-2" title={booking.dropoff_address || 'Chưa xác định'}>
                                                        {booking.dropoff_address || 'Chưa xác định'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {booking.note && (
                                            <div className="bg-amber-50/50 px-4 py-3 rounded-xl text-xs text-slate-600 italic mb-5 border border-amber-100/50 flex items-start gap-2">
                                                <span className="font-bold text-amber-600 not-italic shrink-0">Ghi chú:</span>
                                                <span className="line-clamp-2">{booking.note}</span>
                                            </div>
                                        )}

                                        {/* Improved Button */}
                                        <button
                                            onClick={() => handleAcceptBooking(booking.id, booking.service_type)}
                                            disabled={processingId === booking.id}
                                            className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:to-slate-700 active:scale-[0.98] transition-all flex items-center justify-between px-6 disabled:opacity-70 disabled:cursor-not-allowed group-hover:shadow-amber-500/10 relative overflow-hidden"
                                        >
                                            {processingId === booking.id ? (
                                                <div className="w-full flex justify-center items-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Đang xử lý...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="flex items-center gap-2 text-[15px]">
                                                        Nhận Chuyến Ngay
                                                        <ChevronRight className="w-4 h-4 text-white/50" />
                                                    </span>

                                                    <span className="bg-amber-400 text-slate-900 text-xs font-extra-bold px-3 py-1.5 rounded-lg shadow-sm border border-amber-300">
                                                        Phí {booking.service_type === 'bao-xe' ? '140k' : '25k'}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                ) : (
                    /* My Bookings List */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2 pt-2">
                            <h3 className="font-extrabold text-lg text-slate-800 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                Chuyến đã nhận <span className="text-slate-400 font-normal text-sm">({myBookings.length})</span>
                            </h3>
                        </div>

                        {myBookings.length === 0 ? (
                            <div className="bg-white p-12 rounded-[2rem] text-center border-2 border-dashed border-slate-200">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 grayscale opacity-50">
                                    <Car className="w-10 h-10 text-slate-400" />
                                </div>
                                <h3 className="text-slate-900 font-bold mb-2 text-lg">Bạn chưa có chuyến nào</h3>
                                <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Hãy chuyển sang tab "Tìm Khách" và nhận chuyến đầu tiên ngay!</p>
                            </div>
                        ) : (
                            myBookings.map((booking) => (
                                <div key={booking.id} className="bg-white p-6 rounded-[1.5rem] shadow-sm border-2 border-green-500/10 hover:border-green-500/30 transition-all relative overflow-hidden">
                                    <div className="absolute top-0 right-0 bg-green-100 text-green-800 text-[10px] font-bold px-3 py-1.5 rounded-bl-[1rem] flex items-center gap-1.5 z-10">
                                        <Clock className="w-3 h-3" /> {getTimeAgo(booking.created_at)}
                                    </div>

                                    {/* Minimal Header */}
                                    <div className="flex justify-between items-end mb-4 pr-16 bg-gradient-to-r from-green-50/30 to-transparent -mx-6 -mt-6 p-6 pb-4">
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900">{booking.name}</h4>
                                            <p className="text-[10px] font-mono text-slate-400 font-bold tracking-wider mt-0.5">#{booking.id.slice(0, 8)}</p>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mb-6 border-b border-slate-50 pb-6">
                                        <div className="flex-1 space-y-4">
                                            <div className="flex gap-3 items-start">
                                                <div className="w-5 h-5 mt-0.5 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                                </div>
                                                <p className="text-[15px] font-medium text-slate-800 leading-snug line-clamp-2">{booking.pickup_address}</p>
                                            </div>
                                            <div className="flex gap-3 items-start">
                                                <div className="w-5 h-5 mt-0.5 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                                                    <div className="w-2 h-2 rounded-full bg-orange-600"></div>
                                                </div>
                                                <p className="text-[15px] font-medium text-slate-800 leading-snug line-clamp-2">{booking.dropoff_address || 'Chưa xác định'}</p>
                                            </div>
                                        </div>
                                        <div className="shrink-0 text-right pl-3 border-l border-slate-50 flex flex-col justify-center">
                                            <span className="block text-[10px] text-slate-400 font-bold uppercase mb-1">Giá cước</span>
                                            <div className="font-black text-amber-600 text-lg">
                                                {booking.estimated_price?.toLocaleString('vi-VN')}đ
                                            </div>
                                            <div className="mt-2 text-right">
                                                <span className="text-[10px] bg-slate-100 px-2.5 py-1 rounded-md font-bold text-slate-600">{booking.seat_count} ghế</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-[1fr,auto] gap-3">
                                        <a
                                            href={`tel:${booking.phone}`}
                                            className="bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5"
                                        >
                                            <Phone className="w-5 h-5" />
                                            <span>Gọi Khách: <span className="font-mono text-lg">{booking.phone}</span></span>
                                        </a>
                                        <a href={`sms:${booking.phone}`} className="w-14 h-full flex items-center justify-center bg-slate-100 rounded-xl hover:bg-slate-200 text-slate-600 transition-colors">
                                            <div className="relative">
                                                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                                                <Bell className="w-6 h-6" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Top Up Modal */}
            {showTopUpModal && (
                <div
                    onClick={() => setShowTopUpModal(false)}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-sm p-6 relative max-h-[90vh] overflow-y-auto transform scale-100 animate-in zoom-in-95 duration-200"
                    >
                        <button
                            onClick={() => setShowTopUpModal(false)}
                            className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100 transition-colors z-10"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>

                        <div className="text-center mb-8 mt-2">
                            <h3 className="text-xl font-extrabold text-slate-900">Nạp tiền vào ví</h3>
                            <p className="text-slate-500 text-sm mt-1">Quét mã QR để chuyển khoản</p>
                        </div>

                        <div className="bg-white p-4 rounded-2xl mb-8 border-2 border-slate-100 shadow-sm relative group overflow-hidden">
                            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500 rounded-bl-[4rem] z-0 opacity-10"></div>
                            <img
                                src="/images/qr-payment.png"
                                alt="QR Payment"
                                className="w-full h-auto max-h-64 object-contain mx-auto rounded-lg mix-blend-multiply relative z-10"
                            />
                        </div>

                        <div className="space-y-4 mb-8 bg-slate-50 p-5 rounded-2xl">
                            <div className="flex justify-between items-center border-b border-slate-200 pb-3 border-dashed">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Ngân hàng</span>
                                <span className="font-bold text-slate-900">Techcombank</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-3 border-dashed">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Số tài khoản</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-bold text-lg text-slate-900 tracking-wider">19034037994017</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-3 border-dashed">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Chủ tài khoản</span>
                                <span className="font-bold text-slate-900">HA MINH TU</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Nội dung</span>
                                <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">NAP {driver.phone}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setShowTopUpModal(false);
                                alert('Hệ thống đã ghi nhận yêu cầu. Vui lòng chờ 5-10 phút để tiền vào ví.');
                            }}
                            className="w-full bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-600/20 hover:bg-green-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            Xác nhận đã chuyển khoản
                        </button>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {confirmBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4 sm:p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] p-6 max-w-sm w-full shadow-2xl transform animate-in slide-in-from-bottom-10 duration-300">
                        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-amber-50">
                            <Clock className="w-8 h-8 text-amber-600" />
                        </div>
                        <h2 className="text-xl font-bold text-center text-slate-900 mb-2">
                            Xác nhận nhận chuyến?
                        </h2>
                        <p className="text-center text-slate-500 mb-8 text-sm">
                            Phí nhận chuyến là <span className="font-bold text-amber-600 text-base">{confirmBooking.serviceType === 'bao-xe' ? '140.000đ' : '25.000đ'}</span>. <br />Số tiền sẽ được trừ vào ví của bạn.
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setConfirmBooking(null)}
                                className="py-3.5 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={performAcceptBooking}
                                className="py-3.5 rounded-xl font-bold bg-amber-500 text-white hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30"
                            >
                                Đồng ý
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {successBooking && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl transform animate-in zoom-in-95 duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

                        {/* Success Icon */}
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">
                            Tuyệt vời!
                        </h2>
                        <p className="text-center text-slate-500 mb-8 text-sm">
                            Bạn đã nhận chuyến thành công. Vui lòng liên hệ khách ngay.
                        </p>

                        {/* Customer Info */}
                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Số điện thoại khách</p>
                                    <p className="text-xl font-bold text-slate-900 tracking-tight">{successBooking.phone}</p>
                                </div>
                                <a
                                    href={`tel:${successBooking.phone}`}
                                    className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 text-white hover:scale-105 transition-transform"
                                >
                                    <Phone className="w-6 h-6" />
                                </a>
                            </div>
                        </div>

                        {/* Close Button */}
                        <button
                            onClick={() => setSuccessBooking(null)}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

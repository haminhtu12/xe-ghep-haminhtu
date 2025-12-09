'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, XCircle, Phone, MapPin, Calendar, LogOut } from 'lucide-react';

interface Booking {
    id: string;
    name: string;
    phone: string;
    pickup_address: string;
    dropoff_address: string | null;
    service_type: string;
    direction: string;
    estimated_price: number;
    seat_count: number;
    note: string | null;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    created_at: string;
}

export default function AdminPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const router = useRouter();

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings');
            const data = await response.json();
            setBookings(data.bookings || []);
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/bookings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const filteredBookings = filter === 'all'
        ? bookings
        : bookings.filter(b => b.status === filter);

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            confirmed: 'bg-blue-100 text-blue-700',
            completed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700',
        };
        const labels = {
            pending: 'Chờ xử lý',
            confirmed: 'Đã xác nhận',
            completed: 'Hoàn thành',
            cancelled: 'Đã hủy',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">Quản lý Đơn hàng</h1>
                            <p className="text-slate-500">Tổng số đơn: <span className="font-bold text-amber-600">{bookings.length}</span></p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                        </button>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex gap-3 pt-4 border-t border-slate-100">
                        <button className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold shadow-md">
                            Đơn hàng
                        </button>
                        <button
                            onClick={() => router.push('/admin/drivers')}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                        >
                            Tài xế
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex gap-3 flex-wrap">
                    {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === status
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {status === 'all' ? 'Tất cả' : status === 'pending' ? 'Chờ xử lý' : status === 'confirmed' ? 'Đã xác nhận' : status === 'completed' ? 'Hoàn thành' : 'Đã hủy'}
                        </button>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <p className="text-slate-400 text-lg">Chưa có đơn hàng nào</p>
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{booking.name}</h3>
                                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                                            <Phone className="w-4 h-4" />
                                            <a href={`tel:${booking.phone}`} className="hover:text-amber-600 font-medium">
                                                {booking.phone}
                                            </a>
                                        </p>
                                    </div>
                                    {getStatusBadge(booking.status)}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Lộ trình</p>
                                        <p className="text-slate-700 font-semibold">
                                            {booking.direction === 'hn-th' ? 'Hà Nội → Thanh Hóa' : 'Thanh Hóa → Hà Nội'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Loại xe</p>
                                        <p className="text-slate-700 font-semibold">{booking.service_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Điểm đón</p>
                                        <p className="text-slate-700 flex items-start gap-2">
                                            <MapPin className="w-4 h-4 mt-1 shrink-0" />
                                            {booking.pickup_address}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Điểm trả</p>
                                        <p className="text-slate-700">{booking.dropoff_address || 'Trung tâm'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Giá ước tính</p>
                                        <p className="text-emerald-600 font-bold text-lg">
                                            {booking.estimated_price.toLocaleString('vi-VN')}đ ({booking.seat_count} ghế)
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Thời gian đặt</p>
                                        <p className="text-slate-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(booking.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>

                                {booking.note && (
                                    <div className="bg-slate-50 rounded-xl p-3 mb-4">
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Ghi chú</p>
                                        <p className="text-slate-700">{booking.note}</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-2 flex-wrap">
                                    {booking.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(booking.id, 'confirmed')}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Xác nhận
                                            </button>
                                            <button
                                                onClick={() => updateStatus(booking.id, 'cancelled')}
                                                className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Hủy
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'confirmed' && (
                                        <button
                                            onClick={() => updateStatus(booking.id, 'completed')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Hoàn thành
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

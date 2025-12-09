'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Phone, Car, Calendar, LogOut, Wallet, Plus } from 'lucide-react';

interface Driver {
    id: string;
    name: string;
    phone: string;
    car_type: string;
    license_plate: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    wallet_balance: number;
}

export default function DriversAdminPage() {
    const [drivers, setDrivers] = useState<Driver[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [topUpModal, setTopUpModal] = useState<{ isOpen: boolean; driverId: string | null; driverName: string; amount: string }>({
        isOpen: false,
        driverId: null,
        driverName: '',
        amount: ''
    });
    const router = useRouter();

    useEffect(() => {
        fetchDrivers();
    }, []);

    const fetchDrivers = async () => {
        try {
            const response = await fetch('/api/drivers');
            const data = await response.json();
            setDrivers(data.drivers || []);
        } catch (error) {
            console.error('Failed to fetch drivers:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch('/api/drivers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
            });
            fetchDrivers(); // Refresh list
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topUpModal.driverId || !topUpModal.amount) return;

        try {
            const res = await fetch('/api/admin/drivers/topup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    driverId: topUpModal.driverId,
                    amount: parseInt(topUpModal.amount)
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert(data.message);
                setTopUpModal({ isOpen: false, driverId: null, driverName: '', amount: '' });
                fetchDrivers();
            } else {
                alert(data.error || 'Lỗi nạp tiền');
            }
        } catch (error) {
            console.error('Top up error:', error);
            alert('Lỗi kết nối');
        }
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const filteredDrivers = filter === 'all'
        ? drivers
        : drivers.filter(d => d.status === filter);

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-700',
            approved: 'bg-green-100 text-green-700',
            rejected: 'bg-red-100 text-red-700',
        };
        const labels = {
            pending: 'Chờ duyệt',
            approved: 'Đã duyệt',
            rejected: 'Từ chối',
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
                            <h1 className="text-3xl font-bold text-slate-800 mb-2">Quản lý Tài xế</h1>
                            <p className="text-slate-500">Tổng số tài xế: <span className="font-bold text-amber-600">{drivers.length}</span></p>
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
                        <button
                            onClick={() => router.push('/admin')}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors"
                        >
                            Đơn hàng
                        </button>
                        <button className="px-4 py-2 bg-amber-500 text-white rounded-xl font-semibold shadow-md">
                            Tài xế
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl shadow-lg p-4 mb-6 flex gap-3 flex-wrap">
                    {['all', 'pending', 'approved', 'rejected'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all ${filter === status
                                ? 'bg-amber-500 text-white shadow-lg'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                        >
                            {status === 'all' ? 'Tất cả' : status === 'pending' ? 'Chờ duyệt' : status === 'approved' ? 'Đã duyệt' : 'Từ chối'}
                        </button>
                    ))}
                </div>

                {/* Drivers List */}
                <div className="space-y-4">
                    {filteredDrivers.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                            <p className="text-slate-400 text-lg">Chưa có tài xế nào</p>
                        </div>
                    ) : (
                        filteredDrivers.map((driver) => (
                            <div key={driver.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">{driver.name}</h3>
                                        <p className="text-slate-500 flex items-center gap-2 mt-1">
                                            <Phone className="w-4 h-4" />
                                            <a href={`tel:${driver.phone}`} className="hover:text-amber-600 font-medium">
                                                {driver.phone}
                                            </a>
                                        </p>
                                    </div>
                                    {getStatusBadge(driver.status)}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Loại xe</p>
                                        <p className="text-slate-700 font-semibold flex items-center gap-2">
                                            <Car className="w-4 h-4" />
                                            {driver.car_type}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Biển số</p>
                                        <p className="text-slate-700 font-semibold">{driver.license_plate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Ví tài xế</p>
                                        <p className="text-emerald-600 font-bold text-lg flex items-center gap-1">
                                            <Wallet className="w-4 h-4" />
                                            {(driver.wallet_balance || 0).toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Ngày đăng ký</p>
                                        <p className="text-slate-700 flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(driver.created_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2 flex-wrap border-t border-slate-100 pt-4">
                                    <button
                                        onClick={() => setTopUpModal({ isOpen: true, driverId: driver.id, driverName: driver.name, amount: '' })}
                                        className="px-4 py-2 bg-amber-100 text-amber-700 hover:bg-amber-200 rounded-xl font-bold transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Nạp tiền
                                    </button>

                                    {driver.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => updateStatus(driver.id, 'approved')}
                                                className="px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Duyệt
                                            </button>
                                            <button
                                                onClick={() => updateStatus(driver.id, 'rejected')}
                                                className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center gap-2"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Từ chối
                                            </button>
                                        </>
                                    )}
                                    {driver.status === 'rejected' && (
                                        <button
                                            onClick={() => updateStatus(driver.id, 'approved')}
                                            className="px-4 py-2 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Duyệt lại
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Top Up Modal */}
            {topUpModal.isOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-slate-800">Nạp tiền cho tài xế</h3>
                            <button
                                onClick={() => setTopUpModal(prev => ({ ...prev, isOpen: false }))}
                                className="p-2 hover:bg-slate-100 rounded-full"
                            >
                                <XCircle className="w-6 h-6 text-slate-400" />
                            </button>
                        </div>

                        <form onSubmit={handleTopUp}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tài xế</label>
                                <input
                                    type="text"
                                    value={topUpModal.driverName}
                                    disabled
                                    className="w-full px-4 py-3 rounded-xl bg-slate-100 border-none font-bold text-slate-600"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Số tiền nạp (VNĐ)</label>
                                <input
                                    type="number"
                                    value={topUpModal.amount}
                                    onChange={(e) => setTopUpModal(prev => ({ ...prev, amount: e.target.value }))}
                                    placeholder="Ví dụ: 500000"
                                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none font-bold text-lg"
                                    autoFocus
                                    required
                                />
                                <div className="flex gap-2 mt-2">
                                    {[100000, 200000, 500000, 1000000].map(amt => (
                                        <button
                                            key={amt}
                                            type="button"
                                            onClick={() => setTopUpModal(prev => ({ ...prev, amount: amt.toString() }))}
                                            className="px-3 py-1 bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-700 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            +{amt.toLocaleString()}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amber-500 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-amber-600 active:scale-95 transition-all"
                            >
                                Xác nhận nạp tiền
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

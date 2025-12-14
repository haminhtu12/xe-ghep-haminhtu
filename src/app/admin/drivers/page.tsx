'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Phone, Car, Calendar, LogOut, Wallet, Plus, Search, Edit, Trash2, ShieldCheck, Filter, X, MoreHorizontal } from 'lucide-react';

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
    const [searchTerm, setSearchTerm] = useState('');
    const [driversStats, setDriversStats] = useState({ total: 0, active: 0, pending: 0 });

    const [topUpModal, setTopUpModal] = useState<{ isOpen: boolean; driverId: string | null; driverName: string; amount: string }>({
        isOpen: false,
        driverId: null,
        driverName: '',
        amount: ''
    });

    const [driverModal, setDriverModal] = useState<{ isOpen: boolean; mode: 'add' | 'edit'; data: Partial<Driver> }>({
        isOpen: false,
        mode: 'add',
        data: { car_type: 'Xe 5 chỗ' }
    });

    const router = useRouter();

    useEffect(() => {
        fetchDrivers();
    }, []);

    useEffect(() => {
        const total = drivers.length;
        const active = drivers.filter(d => d.status === 'approved').length;
        const pending = drivers.filter(d => d.status === 'pending').length;
        setDriversStats({ total, active, pending });
    }, [drivers]);

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
            fetchDrivers();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa tài xế này không? Hành động này không thể hoàn tác.')) return;
        try {
            await fetch(`/api/drivers?id=${id}`, {
                method: 'DELETE',
            });
            fetchDrivers();
        } catch (error) {
            console.error('Failed to delete driver:', error);
            alert('Lỗi khi xóa tài xế');
        }
    };

    const handleDriverSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { mode, data } = driverModal;

        try {
            if (mode === 'add') {
                const res = await fetch('/api/drivers', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: data.name,
                        phone: data.phone,
                        carType: data.car_type || 'Xe 5 chỗ',
                        licensePlate: data.license_plate
                    }),
                });
                if (!res.ok) throw new Error('Failed to create');
            } else {
                const res = await fetch('/api/drivers', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: data.id,
                        name: data.name,
                        phone: data.phone,
                        carType: data.car_type,
                        licensePlate: data.license_plate
                    }),
                });
                if (!res.ok) throw new Error('Failed to update');
            }

            setDriverModal({ isOpen: false, mode: 'add', data: { car_type: 'Xe 5 chỗ' } });
            fetchDrivers();
        } catch (error) {
            console.error('Error submitting driver:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại.');
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

    const filteredDrivers = drivers.filter(d => {
        const matchesFilter = filter === 'all' || d.status === filter;
        const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            d.phone.includes(searchTerm) ||
            d.license_plate.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const getStatusBadge = (status: string) => {
        const configs = {
            pending: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'Chờ duyệt', icon: <ClockIcon className="w-3.5 h-3.5" /> },
            approved: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Hoạt động', icon: <CheckCircle className="w-3.5 h-3.5" /> },
            rejected: { color: 'bg-red-100 text-red-700 border-red-200', label: 'Đã chặn', icon: <XCircle className="w-3.5 h-3.5" /> },
        };
        const config = configs[status as keyof typeof configs];
        return (
            <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center gap-1.5 w-fit ${config.color}`}>
                {config.icon}
                {config.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-medium">Đang tải dữ liệu...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-8">
                            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                                    <Car className="w-5 h-5" />
                                </div>
                                <span className="hidden sm:inline tracking-tight">Quản Trị Viên</span>
                            </h1>
                            <nav className="hidden md:flex gap-1">
                                <button
                                    onClick={() => router.push('/admin')}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
                                >
                                    Đơn hàng
                                </button>
                                <button className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold">
                                    Tài xế
                                </button>
                            </nav>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                Admin
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Đăng xuất"
                            >
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Tổng tài xế</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{driversStats.total}</h3>
                        </div>
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                            <Car className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Đang hoạt động</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{driversStats.active}</h3>
                        </div>
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-slate-500 text-sm font-medium">Chờ duyệt</p>
                            <h3 className="text-2xl font-bold text-slate-800 mt-1">{driversStats.pending}</h3>
                        </div>
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center">
                            <ClockIcon className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4 items-center">
                        <div className="flex gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm tài xế..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none text-sm transition-all"
                                />
                            </div>
                            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                                {['all', 'pending', 'approved'].map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all ${filter === f
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-500 hover:text-slate-700'
                                            }`}
                                    >
                                        {f === 'all' ? 'Tất cả' : f === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => setDriverModal({ isOpen: true, mode: 'add', data: { car_type: 'Xe 5 chỗ' } })}
                            className="w-full md:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Thêm tài xế</span>
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-4">Tài xế</th>
                                    <th className="px-6 py-4">Thông tin xe</th>
                                    <th className="px-6 py-4">Trạng thái</th>
                                    <th className="px-6 py-4 text-right">Số dư ví</th>
                                    <th className="px-6 py-4 text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredDrivers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                                                    <Search className="w-6 h-6 text-slate-300" />
                                                </div>
                                                <p>Không tìm thấy tài xế nào</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredDrivers.map((driver) => (
                                        <tr key={driver.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm border border-slate-200 uppercase">
                                                        {driver.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-slate-900 leading-tight">{driver.name}</div>
                                                        <div className="text-sm text-slate-500 flex items-center gap-1 mt-0.5">
                                                            <Phone className="w-3 h-3" /> {driver.phone}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm text-slate-900 font-medium">{driver.car_type}</div>
                                                <div className="text-xs text-slate-500 font-mono mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded w-fit border border-slate-200">
                                                    {driver.license_plate}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(driver.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="font-bold text-emerald-600">
                                                    {(driver.wallet_balance || 0).toLocaleString('vi-VN')}đ
                                                </div>
                                                <button
                                                    onClick={() => setTopUpModal({ isOpen: true, driverId: driver.id, driverName: driver.name, amount: '' })}
                                                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline mt-1"
                                                >
                                                    + Nạp tiền
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    {driver.status === 'pending' ? (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus(driver.id, 'approved')}
                                                                className="p-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all shadow-sm"
                                                            >
                                                                Duyệt
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus(driver.id, 'rejected')}
                                                                className="p-1 px-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-red-600 rounded text-xs font-bold transition-all"
                                                            >
                                                                Từ chối
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setDriverModal({ isOpen: true, mode: 'edit', data: { ...driver } })}
                                                                className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-200 rounded-lg transition-all shadow-sm"
                                                                title="Sửa thông tin"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(driver.id)}
                                                                className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200 rounded-lg transition-all shadow-sm"
                                                                title="Xóa tài xế"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

            {/* Modals Container */}
            {(topUpModal.isOpen || driverModal.isOpen) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
                        setTopUpModal(prev => ({ ...prev, isOpen: false }));
                        setDriverModal(prev => ({ ...prev, isOpen: false }));
                    }}></div>

                    {/* Top Up Modal */}
                    {topUpModal.isOpen && (
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                                <h3 className="font-bold text-slate-800">Nạp tiền vào ví</h3>
                                <button onClick={() => setTopUpModal(prev => ({ ...prev, isOpen: false }))} className="text-slate-400 hover:text-slate-600">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-6">
                                <form onSubmit={handleTopUp}>
                                    <div className="mb-6">
                                        <p className="text-sm text-slate-500 mb-2">Tài xế: <span className="font-bold text-slate-800">{topUpModal.driverName}</span></p>
                                        <label className="block text-xs font-bold text-slate-700 uppercase mb-2">Số tiền (VNĐ)</label>
                                        <input
                                            type="number"
                                            value={topUpModal.amount}
                                            onChange={(e) => setTopUpModal(prev => ({ ...prev, amount: e.target.value }))}
                                            placeholder="Nhập số tiền..."
                                            className="w-full px-4 py-3 text-lg font-bold text-slate-800 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                            autoFocus
                                            required
                                        />
                                        <div className="grid grid-cols-2 gap-2 mt-3">
                                            {[100000, 200000, 500000, 1000000].map(amt => (
                                                <button
                                                    key={amt}
                                                    type="button"
                                                    onClick={() => setTopUpModal(prev => ({ ...prev, amount: amt.toString() }))}
                                                    className="px-3 py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-lg text-xs font-semibold border border-slate-200 hover:border-blue-200 transition-all"
                                                >
                                                    +{amt.toLocaleString()}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
                                    >
                                        Xác nhận nạp
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* Driver Modal */}
                    {driverModal.isOpen && (
                        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50/50">
                                <h3 className="text-lg font-bold text-slate-800">
                                    {driverModal.mode === 'add' ? 'Thêm Tài xế Mới' : 'Cập nhật Thông tin'}
                                </h3>
                                <button
                                    onClick={() => setDriverModal(prev => ({ ...prev, isOpen: false }))}
                                    className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleDriverSubmit} className="flex-1 overflow-y-auto p-6">
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
                                            <input
                                                type="text"
                                                required
                                                value={driverModal.data.name || ''}
                                                onChange={(e) => setDriverModal(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                placeholder="Nguyễn Văn A"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                required
                                                value={driverModal.data.phone || ''}
                                                onChange={(e) => setDriverModal(prev => ({ ...prev, data: { ...prev.data, phone: e.target.value } }))}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                                                placeholder="0912 345 678"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Loại xe</label>
                                            <select
                                                value={driverModal.data.car_type || 'Xe 5 chỗ'}
                                                onChange={(e) => setDriverModal(prev => ({ ...prev, data: { ...prev.data, car_type: e.target.value } }))}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white"
                                            >
                                                <option value="Xe 5 chỗ">Xe 5 chỗ</option>
                                                <option value="Xe 7 chỗ">Xe 7 chỗ</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-2">Biển số</label>
                                            <input
                                                type="text"
                                                required
                                                value={driverModal.data.license_plate || ''}
                                                onChange={(e) => setDriverModal(prev => ({ ...prev, data: { ...prev.data, license_plate: e.target.value } }))}
                                                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-mono uppercase"
                                                placeholder="30A-123.45"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        type="submit"
                                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all"
                                    >
                                        {driverModal.mode === 'add' ? 'Thêm Tài xế' : 'Lưu Thay đổi'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function ClockIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
    );
}

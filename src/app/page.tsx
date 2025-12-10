'use client';

import SearchForm from '@/components/SearchForm';
import { Car, Shield, Clock, DollarSign, LayoutDashboard, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    const checkDriver = async () => {
      try {
        const res = await fetch('/api/drivers/me');
        if (res.ok) {
          setIsDriver(true);
        }
      } catch (error) {
        console.error('Auth check failed', error);
      }
    };
    checkDriver();
  }, []);

  return (
    <main className="min-h-screen pb-20">
      {/* Hero Section - Updated with Warm/Dark Styling */}
      <section className="relative bg-slate-900 text-white pb-24 pt-24 md:pb-32 md:pt-32 overflow-hidden">
        {/* Abstract Background - Gold & Dark */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-amber-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
          <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px] opacity-10"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">


          <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
            Chuyên Tuyến <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Hà Nội ⇄ Thanh Hóa</span>
          </h1>

          <p className="text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed">
            Dịch vụ xe ghép, xe tiện chuyến giá rẻ, uy tín. <br className="hidden md:block" />
            Đón trả tận nơi - Không bắt khách dọc đường.
          </p>

          {isDriver ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/tai-xe/dashboard"
                className="bg-amber-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-amber-600 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-6 h-6" />
                Vào Trang Tài Xế
              </Link>
              <a
                href="/api/drivers/logout"
                className="bg-red-500/20 text-red-200 border border-red-500/50 px-8 py-4 rounded-full font-bold text-lg hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
              >
                <LogOut className="w-6 h-6" />
                Đăng xuất
              </a>
            </div>
          ) : (
            <button
              onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-amber-500/30 hover:scale-105 transition-all animate-bounce-slow"
            >
              Đặt xe ngay
            </button>
          )}
        </div>
      </section>

      {/* Search Form - Overlapping layout with reduced negative margin for balance */}
      <div id="booking-form" className="px-4 relative z-20 -mt-16">
        <SearchForm />

        {/* Subtle Driver CTA - Hide if Driver */}
        {!isDriver && (
          <div className="text-center mt-6">
            <a href="/tai-xe" className="inline-flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors font-medium bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-slate-200 shadow-sm hover:shadow-md">
              <span>🚗 Bạn là tài xế tiện chuyến?</span>
              <span className="underline decoration-amber-500 underline-offset-2 font-bold text-amber-600">Đăng ký nhận khách ngay</span>
            </a>
          </div>
        )}
      </div>

      {/* Features Section - Clean & Trustworthy */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Tại sao chọn chúng tôi?
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Chúng tôi cam kết mang lại trải nghiệm di chuyển an toàn, tiết kiệm và thoải mái nhất cho bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/20 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Đặt Xe Nhanh</h3>
              <p className="text-slate-500 leading-relaxed">
                Chỉ cần 30 giây để tìm được chuyến xe ưng ý. Tài xế sẽ liên hệ đón bạn ngay lập tức.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/20 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Tiết Kiệm 40%</h3>
              <p className="text-slate-500 leading-relaxed">
                Giá rẻ hơn taxi truyền thống đến 40%. Biết trước giá, không lo phát sinh chi phí.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/20 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">An Toàn Tuyệt Đối</h3>
              <p className="text-slate-500 leading-relaxed">
                100% tài xế được xác thực danh tính. Xem đánh giá thực tế từ các hành khách trước.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 md:p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/20 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-900">Đa Dạng Loại Xe</h3>
              <p className="text-slate-500 leading-relaxed">
                Từ xe 4 chỗ, 7 chỗ đến xe sang Limousine. Phù hợp mọi nhu cầu di chuyển của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Driver CTA Section - Hide if Driver */}
      {!isDriver && (
        <section className="py-20 bg-slate-900 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-slate-800/30 skew-x-12 transform origin-top"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-left max-w-2xl">
              <span className="text-amber-500 font-bold tracking-wider uppercase mb-2 block">Cơ hội cho tài xế</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white leading-tight">
                Có xe nhàn rỗi? <br /> Kiếm thêm <span className="text-amber-500">15 - 20 triệu/tháng</span>
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </div>
                  <p className="text-xl text-slate-300">Kết hợp chở khách tiện chuyến - <span className="text-white font-bold">Không áp doanh số</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </div>
                  <p className="text-xl text-slate-300">Hệ thống tự động bắn khách - <span className="text-white font-bold">Không cắt phế</span></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-500 font-bold">✓</span>
                  </div>
                  <p className="text-xl text-slate-300">Nhận tiền mặt ngay sau chuyến đi</p>
                </div>
              </div>
              <div className="flex gap-4">
                <a href="/tai-xe" className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20">
                  Đăng ký ngay
                </a>
                <a href="/tai-xe" className="px-8 py-4 rounded-xl font-bold text-lg text-slate-300 border border-slate-700 hover:bg-slate-800 transition-all">
                  Tìm hiểu thêm
                </a>
              </div>
            </div>

            {/* Abstract Graphic Element placeholder */}
            <div className="w-full md:w-1/3 aspect-square bg-gradient-to-tr from-amber-500 to-orange-600 rounded-3xl opacity-20 rotate-12 transform translate-x-10"></div>
          </div>
        </section>
      )}
    </main>
  );
}

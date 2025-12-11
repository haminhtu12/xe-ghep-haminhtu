'use client';

import SearchForm from '@/components/SearchForm';
import { Car, Shield, Clock, DollarSign, LayoutDashboard, LogOut, Users } from 'lucide-react';
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
      {/* Hero Section - Updated with Premium/Clean Styling */}
      <section className="relative bg-slate-900 text-white pb-8 pt-20 md:pb-12 md:pt-28 overflow-hidden">
        {/* Abstract Background - Reduced Yellow, More Blue/Dark */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[80px]"></div>
          <div className="absolute top-20 -left-20 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[60px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">


          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2 md:mb-3 leading-tight">
            Chuyên Tuyến <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-amber-200">Hà Nội ⇄ Thanh Hóa</span>
          </h1>

          <p className="text-sm md:text-lg text-slate-300 max-w-2xl mx-auto mb-4 md:mb-6 leading-relaxed font-normal opacity-90">
            Xe ghép, xe tiện chuyến giá rẻ, uy tín. Đón trả tận nơi.
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
              className="bg-amber-500 text-white px-8 py-3 md:px-10 md:py-3.5 rounded-full font-bold text-sm md:text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-2 mx-auto"
            >
              <Car className="w-4 h-4" />
              Đặt xe ngay
            </button>
          )}
        </div>
      </section>

      {/* Search Form - Overlapping layout with reduced negative margin for balance */}
      <div id="booking-form" className="px-4 relative z-20 -mt-16">
        <SearchForm />
      </div>

      {/* Why Choose Us - Compact & Premium */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Tại sao chọn chúng tôi?</h2>
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">
              Dịch vụ vận tải hành khách hàng đầu tuyến Hà Nội ⇄ Thanh Hóa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Đặt xe nhanh chóng</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Chỉ 2 phút để đặt xe. Tài xế đón trả tận nơi, đúng giờ, không chờ đợi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Xe đời mới, sạch sẽ</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Đội xe 5-7 chỗ đời mới, nội thất sang trọng, luôn được vệ sinh sạch sẽ.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tài xế chuyên nghiệp</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Lái xe an toàn, thân thiện, rành đường. Phục vụ chu đáo, tận tâm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Driver CTA Section - Hide if Driver */}
      {
        !isDriver && (
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
        )
      }

      {/* Subtle Driver CTA - Footer Position */}
      {
        !isDriver && (
          <div className="text-center py-8 bg-slate-900 border-t border-slate-800">
            <a href="/tai-xe" className="inline-flex items-center gap-2 text-xs md:text-sm text-slate-500 hover:text-amber-500 transition-colors font-medium">
              <span>🚗 Bạn là tài xế tiện chuyến?</span>
              <span className="underline decoration-amber-500/50 underline-offset-2">Đăng ký nhận khách ngay</span>
            </a>
          </div>
        )
      }
    </main >
  );
}

'use client';

import SearchForm from '@/components/SearchForm';
import { Car, Shield, Clock, DollarSign, LayoutDashboard, LogOut, Users, Check, ArrowRight } from 'lucide-react';
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
      <section className="relative bg-slate-900 text-white pb-12 pt-60 md:pb-12 md:pt-28 overflow-hidden">
        {/* Abstract Background - Reduced Yellow, More Blue/Dark */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[80px]"></div>
          <div className="absolute top-20 -left-20 w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[60px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10 pt-16 md:pt-0">


          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2 md:mb-3 leading-tight mt-10 md:mt-0">
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
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8 mb-4 w-full max-w-xs mx-auto sm:max-w-none">
              <button
                onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full sm:w-auto bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <Car className="w-5 h-5" />
                Đặt xe ngay
              </button>

              <Link
                href="/tai-xe/login"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/20 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5 text-amber-400" />
                Tài xế đăng ký
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Search Form - Overlapping layout with reduced negative margin for balance */}
      <div id="booking-form" className="px-4 relative z-20 mt-6 md:-mt-16">
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
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                Đặt xe nhanh chóng
                <Check className="w-4 h-4 text-amber-500 bg-amber-100 rounded-full p-0.5" />
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Chỉ 2 phút để đặt xe. Tài xế đón trả tận nơi, đúng giờ, không chờ đợi.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group text-center">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                Xe đời mới, sạch sẽ
                <Check className="w-4 h-4 text-blue-500 bg-blue-100 rounded-full p-0.5" />
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Đội xe 4-7 chỗ đời mới, nội thất sang trọng, luôn được vệ sinh sạch sẽ.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 group text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center justify-center gap-2">
                Tài xế chuyên nghiệp
                <Check className="w-4 h-4 text-green-500 bg-green-100 rounded-full p-0.5" />
              </h3>
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
          <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute right-0 top-0 w-2/3 h-full bg-amber-500/5 -skew-x-12 transform origin-top translate-x-1/4"></div>
            <div className="absolute left-0 bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
              <div className="text-left max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold uppercase tracking-wider mb-4">
                  <Car className="w-4 h-4" />
                  Đối tác tài xế
                </div>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 text-white leading-tight">
                  Lái xe tiện chuyến <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Thu nhập hấp dẫn</span>
                </h2>
                <div className="space-y-5 mb-10">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                      <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Không áp doanh số</h4>
                      <p className="text-slate-400 text-base">Chạy bao nhiêu hưởng bấy nhiêu, tự do thời gian.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                      <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Khách hàng sẵn có</h4>
                      <p className="text-slate-400 text-base">Hệ thống tự động bắn cuốc khách tiện đường cho bạn.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20 shrink-0">
                      <Check className="w-5 h-5 text-green-500" strokeWidth={3} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Thanh toán ngay</h4>
                      <p className="text-slate-400 text-base">Nhận tiền mặt trực tiếp từ khách ngay sau chuyến đi.</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/tai-xe" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl hover:shadow-amber-500/20 transition-all hover:-translate-y-1 text-center">
                    Đăng ký chạy thử ngay
                  </Link>
                  <Link href="/tai-xe" className="px-8 py-4 rounded-2xl font-bold text-lg text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all text-center">
                    Xem chính sách
                  </Link>
                </div>
              </div>

              {/* Right side Visual/Card */}
              <div className="w-full lg:w-1/3 relative group cursor-pointer" onClick={() => window.location.href = '/tai-xe'}>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-8 rounded-3xl relative hover:border-amber-500/50 transition-colors">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-slate-400 text-sm font-medium">Thu nhập trung bình</p>
                      <h3 className="text-3xl font-bold text-white mt-1">15 - 20tr<span className="text-lg font-normal text-slate-500">/tháng</span></h3>
                    </div>
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
                      +12% vs tháng trước
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[70%]"></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Đã đăng ký</span>
                      <span className="text-white font-bold">500+ Tài xế</span>
                    </div>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-700 flex items-center justify-between">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800"></div>
                      ))}
                    </div>
                    <div className="text-amber-500 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      Tham gia ngay <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
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

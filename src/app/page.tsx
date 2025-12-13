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

      {/* Pricing Table - Competitor Standard */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Bảng Giá Niêm Yết</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Cam kết giá rẻ nhất thị trường. Không thu thêm phụ phí. Đi càng đông, giá càng rẻ.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1: Xe Ghép */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-amber-500 transition-all group">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-500 transition-colors">
                  <Car className="w-8 h-8 text-amber-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Xe Ghép / Vé Lẻ</h3>
                <p className="text-sm text-slate-500 mt-1">Hà Nội ⇄ Thanh Hóa</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-3xl font-bold text-amber-600">350k - 450k</span>
                <span className="text-slate-400">/ghế</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li className="flex items-center gap-2 justify-between"><span>Ghế cuối (x7):</span> <span className="font-bold">350.000đ</span></li>
                <li className="flex items-center gap-2 justify-between"><span>Ghế thường:</span> <span className="font-bold">400.000đ</span></li>
                <li className="flex items-center gap-2 justify-between"><span>Ghế đầu VIP:</span> <span className="font-bold">450.000đ</span></li>
              </ul>
              <button onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border border-amber-500 text-amber-600 font-bold hover:bg-amber-500 hover:text-white transition-all">Đặt ngay</button>
            </div>

            {/* Card 2: Bao Hàng Ghế */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">Tiết kiệm</div>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-500 transition-colors">
                  <Users className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bao Hàng Ghế</h3>
                <p className="text-sm text-slate-500 mt-1">Thoải mái - Riêng tư</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-blue-600">900k</span>
                <span className="text-slate-400">/lượt</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Bao trọn hàng ghế sau</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Không phải ngồi ghép</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Thích hợp đi 2-3 người</li>
              </ul>
              <button onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border border-blue-500 text-blue-600 font-bold hover:bg-blue-500 hover:text-white transition-all">Đặt ngay</button>
            </div>

            {/* Card 3: Bao Xe 5 Chỗ */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-green-500 transition-all group">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500 transition-colors">
                  <Shield className="w-8 h-8 text-green-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bao Xe 5 Chỗ</h3>
                <p className="text-sm text-slate-500 mt-1">Xe riêng trọn gói</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-green-600">1.200k</span>
                <span className="text-slate-400">/xe</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Xe đời mới (Vios, Accent...)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Đón trả tận nơi theo yêu cầu</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Giờ giấc tự do</li>
              </ul>
              <button onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border border-green-500 text-green-600 font-bold hover:bg-green-500 hover:text-white transition-all">Đặt ngay</button>
            </div>

            {/* Card 4: Bao Xe 7 Chỗ */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-purple-500 transition-all group">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500 transition-colors">
                  <LayoutDashboard className="w-8 h-8 text-purple-600 group-hover:text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Bao Xe 7 Chỗ</h3>
                <p className="text-sm text-slate-500 mt-1">Xe rộng cho gia đình</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold text-purple-600">1.300k</span>
                <span className="text-slate-400">/xe</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600 mb-6">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Xe rộng (Xpander, Veloz...)</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Đi tối đa 7 người thoải mái</li>
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Cốp rộng chứa nhiều đồ</li>
              </ul>
              <button onClick={() => document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-3 rounded-xl border border-purple-500 text-purple-600 font-bold hover:bg-purple-500 hover:text-white transition-all">Đặt ngay</button>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Content Section - Authority & Trust */}
      <section className="py-16 bg-white border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-slate">
          <h2 className="text-2xl font-bold text-center mb-8">Dịch vụ Xe ghép Hà Nội - Thanh Hóa Uy Tín Hàng Đầu</h2>

          <div className="my-8 rounded-2xl overflow-hidden shadow-lg">
            <img src="/images/driver.png" alt="Tài xế thân thiện mở cửa xe" className="w-full h-64 object-cover md:h-80 hover:scale-105 transition-transform duration-700" />
          </div>

          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Bạn đang tìm kiếm một phương tiện di chuyển <strong>An toàn - Tiết kiệm - Nhanh chóng</strong> giữa Hà Nội và Thanh Hóa?
              Hệ thống <strong>Xe Ghép Hà Nội Thanh Hóa 24/7</strong> tự hào là đơn vị tiên phong áp dụng công nghệ vào vận tải hành khách,
              mang đến trải nghiệm đặt xe 5 sao với chi phí bình dân.
            </p>
            <h3 className="text-xl font-bold text-slate-800">Tại sao nên chọn chúng tôi thay vì xe khách?</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Đón đưa tận nơi:</strong> Không còn cảnh tay xách nách mang ra bến xe Mỹ Đình hay Giáp Bát. Chúng tôi đón bạn tại cửa nhà.</li>
              <li><strong>Giờ giấc linh hoạt:</strong> Xe chạy liên tục mỗi 30 phút/chuyến từ 4h sáng đến 22h đêm. Bạn đi giờ nào cũng có xe.</li>
              <li><strong>Không bắt khách dọc đường:</strong> Cam kết chạy thẳng cao tốc Pháp Vân - Ninh Bình - Thanh Hóa, rút ngắn thời gian di chuyển chỉ còn 2.5 - 3 tiếng.</li>
            </ul>

            <div className="my-8 rounded-2xl overflow-hidden shadow-lg">
              <img src="/images/interior.png" alt="Nội thất xe sang trọng sạch sẽ" className="w-full h-64 object-cover md:h-80 hover:scale-105 transition-transform duration-700" />
            </div>

            <h3 className="text-xl font-bold text-slate-800">Các tuyến xe chính:</h3>
            <p>
              Chúng tôi phục vụ đưa đón tại tất cả các quận nội thành Hà Nội (Cầu Giấy, Thanh Xuân, Hoàng Mai, Hai Bà Trưng...) về TP Thanh Hóa,
              Sầm Sơn, Bỉm Sơn, Quảng Xương, Hoằng Hóa, Hà Trung, Nga Sơn và các huyện lân cận.
            </p>
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200 mt-6 text-center">
              <p className="font-bold text-amber-800 mb-2">ĐẶT XE NGAY ĐỂ GIỮ CHỖ TỐT NHẤT!</p>
              <a href="tel:0334909668" className="text-2xl font-black text-red-600 hover:text-red-700 transition-colors">0334.909.668</a>
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

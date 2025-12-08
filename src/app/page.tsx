import SearchForm from '@/components/SearchForm';
import { Car, Shield, Clock, DollarSign } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-500 via-blue-500 to-purple-600 text-white overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Xe Ghép Tiện Chuyến
              <span className="block text-2xl md:text-3xl font-normal mt-2 text-sky-100">
                Đi chung xe - Tiết kiệm chi phí
              </span>
            </h1>
            <p className="text-lg md:text-xl text-sky-50 max-w-2xl mx-auto">
              Kết nối hành khách và tài xế nhanh chóng, an toàn, giá cả hợp lý
            </p>
          </div>

          {/* Search Form */}
          <SearchForm />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-slate-900">
            Tại sao chọn chúng tôi?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Tìm xe nhanh</h3>
              <p className="text-slate-600">
                Tìm kiếm chuyến đi chỉ trong vài giây. Không cần đăng bài lên nhóm Facebook.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Giá cả minh bạch</h3>
              <p className="text-slate-600">
                Hệ thống tự động gợi ý giá dựa trên quãng đường. Không lo bị "chặt chém".
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">An toàn đảm bảo</h3>
              <p className="text-slate-600">
                Tài xế được xác minh. Thông tin liên hệ rõ ràng, đánh giá từ khách hàng thật.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Car className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">Nhiều lựa chọn</h3>
              <p className="text-slate-600">
                Hàng trăm tài xế sẵn sàng phục vụ. Chọn xe phù hợp với nhu cầu của bạn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-r from-sky-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bạn là tài xế?
          </h2>
          <p className="text-xl text-sky-50 mb-8">
            Đăng ký ngay để tăng thu nhập từ những chuyến đi hàng ngày
          </p>
          <button className="bg-white text-sky-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-sky-50 transition-all hover:scale-105 shadow-xl">
            Đăng ký làm tài xế
          </button>
        </div>
      </section>
    </main>
  );
}

import { Shield, Users, Clock, MapPin, CheckCircle, Award } from 'lucide-react';

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white pb-20">
            {/* Hero Section */}
            <section className="relative bg-slate-900 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-amber-500 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
                    <div className="absolute top-40 -left-20 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[100px] opacity-10"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Về Chúng Tôi
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        XeGhép - Nền tảng kết nối hành khách và tài xế tiện chuyến hàng đầu tuyến Hà Nội ⇄ Thanh Hóa.
                        Chúng tôi mang đến giải pháp di chuyển Tiết Kiệm - An Toàn - Nhanh Chóng.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-amber-600 font-bold tracking-wider uppercase mb-2 block">Sứ mệnh của chúng tôi</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                                Thay đổi cách bạn di chuyển
                            </h2>
                            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
                                Chúng tôi tin rằng mỗi chuyến đi không chỉ là sự di chuyển, mà là một trải nghiệm.
                                Sứ mệnh của XeGhép là tối ưu hóa nguồn lực xã hội bằng cách kết nối những chiếc xe còn ghế trống với những hành khách có nhu cầu đi lại,
                                giúp giảm chi phí cho cả hai bên và giảm ùn tắc giao thông.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-slate-800">Tiết kiệm chi phí</h4>
                                        <p className="text-slate-500">Giảm đến 40% so với taxi truyền thống.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-slate-800">Thân thiện môi trường</h4>
                                        <p className="text-slate-500">Tối ưu hóa số lượng xe lưu thông trên đường.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-slate-800">Kết nối cộng đồng</h4>
                                        <p className="text-slate-500">Xây dựng cộng đồng tài xế và hành khách văn minh.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square rounded-3xl bg-slate-100 overflow-hidden relative shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500">
                                {/* Placeholder for an office or team image if available, using a gradient for now */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                                    <Users className="w-32 h-32 text-slate-400" />
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-xs">
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 font-bold text-xl">
                                        5K+
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">Khách hàng tin dùng</p>
                                        <p className="font-bold text-slate-800 text-lg">Mỗi tháng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Giá trị cốt lõi</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">
                            Những nguyên tắc định hình phong cách phục vụ của chúng tôi.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                                <Shield className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">An Toàn Là Trên Hết</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Chúng tôi kiểm duyệt kỹ càng hồ sơ tài xế và phương tiện. Sự an toàn của bạn là ưu tiên hàng đầu trong mọi chuyến đi.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6 text-amber-600">
                                <Clock className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Đúng Giờ & Tin Cậy</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Thời gian là vàng. Chúng tôi cam kết đón trả đúng giờ và luôn giữ liên lạc thông suốt với khách hàng.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                            <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                                <Award className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Chất Lượng Dịch Vụ</h3>
                            <p className="text-slate-500 leading-relaxed">
                                Không ngừng lắng nghe và cải thiện. Chúng tôi trân trọng mọi phản hồi để mang đến trải nghiệm tốt nhất.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-6">Bạn cần hỗ trợ thêm?</h2>
                    <p className="text-slate-500 mb-8 text-lg">
                        Đội ngũ chăm sóc khách hàng của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của bạn 24/7.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="tel:0912345678" className="bg-amber-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-600 transition-all shadow-lg hover:shadow-amber-500/20">
                            Gọi Hotline: 0912.345.678
                        </a>
                        <a href="/" className="px-8 py-4 rounded-xl font-bold text-lg text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all">
                            Về Trang Chủ
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

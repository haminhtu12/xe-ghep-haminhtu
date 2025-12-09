# Lộ Trình Phát Triển Ứng Dụng Xe Ghép (Giai Đoạn 2)

Tài liệu này phác thảo các bước phát triển tiếp theo để chuyển đổi từ trang Landing Page đơn giản sang một Nền tảng Đặt xe hoàn chỉnh với tính năng quản lý tài xế và tối ưu chuyến đi.

## Mục Tiêu Chính
1.  **Xây dựng Cổng Tài Xế (Driver Portal):** Cho phép tài xế đăng nhập, quản lý trạng thái và tìm khách.
2.  **Hệ thống Định danh & Ví (Auth & Wallet):** Quản lý tài khoản qua SĐT và cơ chế nạp/trừ tiền.
3.  **Tối ưu Ghép Khách (Smart Matching):** Giải quyết bài toán xe rỗng chiều về và tối ưu doanh thu.

---

## Giai Đoạn 1: Định Danh & Cổng Tài Xế (Tuần 1-2)
*Mục tiêu: Tài xế có thể đăng nhập và thao tác cơ bản.*

### 1. Cơ sở dữ liệu (Database)
- [ ] Tạo bảng `drivers`: Lưu thông tin SĐT, Mật khẩu, Tên, Biển số, Loại xe, Số dư ví.
- [ ] Tạo bảng `driver_transactions`: Lưu lịch sử nạp/trừ tiền.
- [ ] Tạo bảng `trips`: Lưu các chuyến đi tài xế đăng ký (hoặc trạng thái "đang chờ").

### 2. Giao diện Tài xế (Web Mobile)
- [ ] **Trang Đăng nhập/Đăng ký (`/tai-xe/login`):**
    - Đơn giản hóa tối đa: Chỉ cần SĐT + Mật khẩu.
    - Tự động tặng 500k vào ví cho tài khoản mới (Chương trình "Vốn khởi nghiệp").
- [ ] **Trang Dashboard (`/tai-xe/dashboard`):**
    - Hiển thị Số dư ví.
    - Nút gạt trạng thái: "Đang ở Hà Nội" / "Đang ở Thanh Hóa".
    - Nút hành động: "Tìm khách ngay" hoặc "Báo giờ chạy".

---

## Giai Đoạn 2: Cơ Chế "Săn Khách" & Ví Tiền (Tuần 3-4)
*Mục tiêu: Vận hành luồng tiền và ghép khách thực tế.*

### 1. Luồng "Săn Khách" (Booking Flow)
- [ ] **Hiển thị Khách hàng:**
    - Tài xế thấy danh sách khách đang đặt xe (lọc theo chiều đi phù hợp với vị trí tài xế).
    - Thông tin hiển thị: Điểm đón/trả, Giá tiền, *SĐT khách bị ẩn 3 số cuối*.
- [ ] **Tranh Đơn (Race to Book):**
    - Tài xế bấm "Nhận khách".
    - Hệ thống kiểm tra số dư ví > 20k.
    - Trừ 20k trong ví -> Hiện full SĐT khách cho tài xế liên hệ.
    - Ẩn cuốc xe đó khỏi các tài xế khác.

### 2. Tính năng "Báo Giờ Về" (Smart Return)
- [ ] Cho phép tài xế đang nghỉ ngơi đăng ký: *"Tôi sẽ xuất phát từ Thanh Hóa lúc 14:00"*.
- [ ] Hiển thị thông tin này lên trang chủ cho khách hàng thấy và đặt chỗ trước.

---

## Giai Đoạn 3: Admin & Vận Hành (Tuần 5)
*Mục tiêu: Bạn có công cụ để quản lý toàn bộ hệ thống.*

- [ ] **Trang Quản lý Tài xế:**
    - Xem danh sách tài xế.
    - Nút "Nạp tiền" thủ công (khi tài xế chuyển khoản).
    - Khóa tài khoản (nếu vi phạm).
- [ ] **Thống kê:** Xem doanh thu, số lượng chuyến đi thành công trong ngày.

---

## Kiến Trúc Kỹ Thuật (Tech Stack)
- **Frontend:** Next.js (Tiếp tục phát triển trên source hiện tại).
- **Backend/Database:** Supabase (PostgreSQL + Auth).
- **Real-time:** Supabase Realtime (Để bắn đơn cho tài xế ngay lập tức).

## Lưu ý Quan Trọng
- **Trải nghiệm Mobile First:** Giao diện tài xế phải cực kỳ dễ bấm trên điện thoại, chữ to, rõ ràng.
- **Tối ưu tốc độ:** Việc "Tranh đơn" yêu cầu xử lý nhanh để tránh 2 tài xế nhận cùng 1 khách.

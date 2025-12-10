# Hướng Dẫn Đưa Web Lên Mạng (Vercel)

Bạn đã có kho chứa mã nguồn (Repository) tại: `git@github.com:vti-haminhtu-exv/xe-ghep.git`

Thực hiện các bước sau để đưa web chạy thực tế:

## Bước 1: Cập nhật mã nguồn mới nhất lên GitHub
Chạy các lệnh sau trong Terminal (Visual Studio Code):

```bash
git add .
git commit -m "Deploy to Vercel: Final version"
git push origin develop
# (Hoặc git push origin main - tùy nhánh chính của bạn)
```

## Bước 2: Tạo dự án trên Vercel
1. Truy cập [https://vercel.com/new](https://vercel.com/new) (Đăng nhập bằng GitHub).
2. Tìm repository **`xe-ghep`** trong danh sách và bấm **Import**.

## Bước 3: Cấu hình Environment Variables (Quan Trọng)
Trong màn hình cấu hình dự án ("Configure Project"), bấm mở rộng mục **Environment Variables**.
Bạn cần thêm chính xác các dòng sau (Copy từ file `.env.local` của bạn):

| Key | Value (Giá trị) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | *(Copy từ .env.local)* |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Copy từ .env.local)* |
| `SPEEDSMS_ACCESS_TOKEN` | *(Copy từ .env.local)* |
| `ADMIN_PASSWORD` | *(Mật khẩu admin bạn muốn đặt)* |

> [!WARNING]
> Nếu thiếu các biến này, các chức năng như Đăng nhập, Gửi tin nhắn, Database sẽ **không hoạt động**.

## Bước 4: Deploy
1. Bấm nút **Deploy**.
2. Chờ khoảng 1-2 phút.
3. Khi hoàn tất, màn hình sẽ hiện pháo hoa. Bấm **"Continue to Dashboard"** -> **"Visit"** để xem trang web của bạn.

## Bước 5: Kiểm tra lại
- Thử đặt xe.
- Thử đăng nhập tài xế.
- Nếu có lỗi, kiểm tra tab **Logs** trên Vercel để xem chi tiết.

# 🚀 Facebook Ads Roadmap - Xe Ghép

## Mục tiêu
Tuyển 50-100 tài xế trong 2-3 tuần đầu với budget 100-200k/ngày.

---

## ✅ Phase 1: Setup & Preparation (Tuần 1)

### [ ] Bước 1: Cài đặt Facebook Pixel (30 phút)
**Deadline:** Hôm nay

**Checklist:**
- [ ] Tạo Facebook Business Manager (nếu chưa có)
- [ ] Tạo Facebook Pixel
- [ ] Cài Pixel vào website (file `_app.tsx` hoặc `layout.tsx`)
- [ ] Test Pixel với Facebook Pixel Helper extension
- [ ] Setup Events:
  - [ ] PageView (tự động)
  - [ ] Lead (khi user nhập SĐT)
  - [ ] CompleteRegistration (khi đăng ký thành công)

**Tài liệu:**
- Facebook Business Manager: https://business.facebook.com
- Pixel Helper: https://chrome.google.com/webstore (search "Facebook Pixel Helper")

---

### [ ] Bước 2: Viết Ad Copy (1-2 giờ)
**Deadline:** Hôm nay

**Checklist:**
- [ ] Viết 10 variations ad copy (xem file `ad-copy.md`)
- [ ] 3 hooks khác nhau:
  - [ ] Hook thu nhập (💰)
  - [ ] Hook FOMO (🔥)
  - [ ] Hook so sánh (vs Grab/Be)
- [ ] Review và chọn 5 bản tốt nhất

**Output:** File `ad-copy.md` với 10 versions

---

### [ ] Bước 3: Chuẩn bị Creative Assets (1-2 ngày)
**Deadline:** Ngày mai - Ngày kia

**Checklist:**
- [ ] **Screenshot App:**
  - [ ] Trang đăng ký tài xế
  - [ ] Dashboard (nếu có)
  - [ ] Thông báo cuốc xe
  - [ ] Số tiền trong ví (mock data OK)

- [ ] **Video (Optional nhưng khuyên làm):**
  - [ ] Quay màn hình app (15-30s)
  - [ ] Hoặc dùng Canva tạo video từ ảnh
  - [ ] Add text overlay: "Tăng thu nhập 10-15 triệu/tháng"

- [ ] **Static Images:**
  - [ ] 3-5 designs trên Canva
  - [ ] Template: Benefit-focused (thu nhập, tự do thời gian)
  - [ ] Kích thước: 1080x1080 (square) hoặc 1200x628 (landscape)

**Tools:**
- Canva: https://canva.com (free)
- Screen recorder: QuickTime (Mac) hoặc OBS (Windows)

---

## ✅ Phase 2: Campaign Setup (Ngày 3-4)

### [ ] Bước 4: Tạo Campaign Structure
**Deadline:** Ngày 3

**Checklist:**
- [ ] Tạo Campaign: "Tuyển Tài Xế - Xe Ghép"
  - [ ] Objective: Conversions (Lead)
  - [ ] Budget: 100k/ngày (test)

- [ ] Tạo 3 Ad Sets (mỗi set 1 targeting):
  - [ ] **Ad Set 1:** Interest - Grab, Uber, Be
  - [ ] **Ad Set 2:** Interest - Ô tô, xe hơi
  - [ ] **Ad Set 3:** Lookalike (nếu có data) hoặc Broad

- [ ] Mỗi Ad Set:
  - [ ] Location: Hà Nội (20km radius)
  - [ ] Age: 25-50
  - [ ] Gender: Nam
  - [ ] Placement: Automatic (để Facebook optimize)

- [ ] Tạo 2 Ads mỗi Ad Set (6 ads total):
  - [ ] Ad 1: Hook thu nhập + Image
  - [ ] Ad 2: Hook FOMO + Video (nếu có)

---

### [ ] Bước 5: Launch Test Campaign
**Deadline:** Ngày 4

**Checklist:**
- [ ] Review tất cả ads
- [ ] Đảm bảo link đúng (landing page `/tai-xe`)
- [ ] Check Pixel hoạt động
- [ ] Submit ads for review
- [ ] Đợi Facebook approve (1-24h)

---

## ✅ Phase 3: Monitoring & Optimization (Ngày 5-10)

### [ ] Bước 6: Monitor Daily (Mỗi ngày)
**Checklist:**
- [ ] Check Ads Manager mỗi sáng
- [ ] Track metrics:
  - [ ] CPR (Cost Per Registration): Mục tiêu < 50k
  - [ ] CTR (Click-Through Rate): Mục tiêu > 2%
  - [ ] CPC (Cost Per Click): Mục tiêu < 3k
  - [ ] Số đăng ký/ngày: Mục tiêu 5-10

- [ ] Ghi chú:
  - [ ] Ad nào perform tốt
  - [ ] Ad nào tệ (CPR > 70k)

---

### [ ] Bước 7: Optimize (Sau 3 ngày)
**Checklist:**
- [ ] Tắt ads có CPR > 70k
- [ ] Tăng budget ads tốt (+20-50%)
- [ ] Test thêm 2-3 ad copies mới
- [ ] Duplicate ad set tốt nhất

---

## ✅ Phase 4: Scale (Tuần 2-3)

### [ ] Bước 8: Scale Budget
**Khi nào:** Khi CPR ổn định < 50k trong 5 ngày

**Checklist:**
- [ ] Tăng budget từ 100k → 200k/ngày
- [ ] Tăng dần 20%/ngày (không tăng đột ngột)
- [ ] Monitor closely
- [ ] Nếu CPR tăng → Giảm budget lại

---

### [ ] Bước 9: Expand Targeting
**Checklist:**
- [ ] Test thêm locations (Hà Nội → Toàn miền Bắc)
- [ ] Test age range khác (18-24, 50-60)
- [ ] Test Lookalike Audience (từ người đã đăng ký)

---

## 📊 Success Metrics

### Week 1 (Test):
- [ ] 20-30 đăng ký
- [ ] CPR < 50k
- [ ] CTR > 2%

### Week 2-3 (Scale):
- [ ] 50-100 đăng ký total
- [ ] CPR < 60k (có thể tăng khi scale)
- [ ] 20-30 tài xế active

---

## 🚨 Red Flags (Dừng ngay nếu)

- [ ] CPR > 100k sau 5 ngày
- [ ] CTR < 1% (ads không hấp dẫn)
- [ ] Approval rate < 50% (nhiều fake accounts)
- [ ] Tài xế đăng ký nhưng không active

---

## 📝 Notes & Learnings

### What Worked:
- (Ghi chú sau khi chạy)

### What Didn't Work:
- (Ghi chú sau khi chạy)

### Next Steps:
- (Ghi chú sau khi chạy)

---

## 🔗 Resources

- Facebook Ads Manager: https://business.facebook.com/adsmanager
- Canva: https://canva.com
- Pixel Helper: https://chrome.google.com/webstore
- Landing Page: https://[your-domain]/tai-xe

---

**Last Updated:** 2025-12-12
**Status:** 🟡 In Progress

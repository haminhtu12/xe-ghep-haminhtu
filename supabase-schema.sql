-- Tạo bảng bookings để lưu đơn đặt xe
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    dropoff_address TEXT,
    service_type TEXT NOT NULL,
    direction TEXT NOT NULL,
    estimated_price INTEGER NOT NULL,
    seat_count INTEGER DEFAULT 1,
    note TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tăng tốc độ query
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_phone ON bookings(phone);

-- Enable Row Level Security (RLS)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép đọc/ghi (tạm thời cho phép tất cả, sau này sẽ thêm authentication)
CREATE POLICY "Allow all access to bookings" ON bookings
    FOR ALL
    USING (true)
    WITH CHECK (true);

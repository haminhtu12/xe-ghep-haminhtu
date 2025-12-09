-- 1. Cập nhật bảng drivers hiện có
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS password TEXT, -- Mật khẩu đăng nhập
ADD COLUMN IF NOT EXISTS wallet_balance INTEGER DEFAULT 0, -- Ví tiền
ADD COLUMN IF NOT EXISTS current_location TEXT DEFAULT 'unknown'; -- Vị trí hiện tại (hanoi/thanhhoa)

-- 2. Tạo bảng lịch sử giao dịch (driver_transactions)
CREATE TABLE IF NOT EXISTS driver_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    driver_id UUID REFERENCES drivers(id),
    amount INTEGER NOT NULL, -- Số tiền (+ hoặc -)
    type TEXT NOT NULL CHECK (type IN ('deposit', 'withdraw', 'booking_fee', 'bonus')), -- Loại giao dịch
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tạo index cho bảng transactions
CREATE INDEX IF NOT EXISTS idx_transactions_driver_id ON driver_transactions(driver_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON driver_transactions(created_at DESC);

-- 4. Enable RLS cho bảng transactions
ALTER TABLE driver_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to driver_transactions" ON driver_transactions
    FOR ALL
    USING (true)
    WITH CHECK (true);

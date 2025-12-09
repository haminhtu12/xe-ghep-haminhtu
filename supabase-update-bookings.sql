-- Add driver_id to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS driver_id UUID REFERENCES drivers(id);

-- Create index for driver_id
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);

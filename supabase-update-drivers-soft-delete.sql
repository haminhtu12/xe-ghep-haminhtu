-- Add deleted_at column to drivers table for soft delete support
ALTER TABLE drivers 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create an index for faster filtering of non-deleted drivers
CREATE INDEX IF NOT EXISTS idx_drivers_deleted_at ON drivers(deleted_at);

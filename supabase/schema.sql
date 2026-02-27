-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- Creates products table for Shivam Computer

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  brand TEXT,
  price INTEGER NOT NULL,
  mrp INTEGER,
  discount_percent INTEGER,
  stock INTEGER NOT NULL DEFAULT 0,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  image TEXT NOT NULL,
  specs JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC(3,1),
  review_count INTEGER,
  warranty TEXT,
  purpose TEXT,
  is_custom_build BOOLEAN DEFAULT false,
  build_time_days INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional; disable for public read)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view products)
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);

-- Allow insert/update/delete for anon (or restrict to auth users - adjust as needed)
CREATE POLICY "Allow all for anon" ON products FOR ALL USING (true) WITH CHECK (true);

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
DROP POLICY IF EXISTS "Allow public read" ON products;
DROP POLICY IF EXISTS "Allow all for anon" ON products;
DROP POLICY IF EXISTS "Allow write for authenticated" ON products;
DROP POLICY IF EXISTS "Allow update for authenticated" ON products;
DROP POLICY IF EXISTS "Allow delete for authenticated" ON products;

CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);

-- Only signed-in users can write to products.
-- This matches the app's "Login -> access admin" flow.
CREATE POLICY "Allow write for authenticated" ON products
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow update for authenticated" ON products
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow delete for authenticated" ON products
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

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

-- Site settings used for homepage/admin configuration (e.g. carousel products)
CREATE TABLE IF NOT EXISTS site_settings (
  setting_key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read settings" ON site_settings;
DROP POLICY IF EXISTS "Allow write settings for authenticated" ON site_settings;
DROP POLICY IF EXISTS "Allow update settings for authenticated" ON site_settings;
DROP POLICY IF EXISTS "Allow delete settings for authenticated" ON site_settings;

CREATE POLICY "Allow public read settings" ON site_settings
FOR SELECT
USING (true);

CREATE POLICY "Allow write settings for authenticated" ON site_settings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow update settings for authenticated" ON site_settings
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow delete settings for authenticated" ON site_settings
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

-- Builder configuration lives in site_settings as JSON (setting_key = 'builder_config').
-- The frontend admin writes and reads that key; no extra table required for the builder wizard.

-- Orders table used by checkout/admin order management
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  placed_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'shipped', 'fulfilled')),
  source TEXT NOT NULL CHECK (source IN ('checkout', 'simulate')),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  address_line TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  payment_method TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal INTEGER NOT NULL DEFAULT 0,
  shipping_charge INTEGER NOT NULL DEFAULT 0,
  grand_total INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read orders" ON orders;
DROP POLICY IF EXISTS "Allow write orders for authenticated" ON orders;
DROP POLICY IF EXISTS "Allow update orders for authenticated" ON orders;
DROP POLICY IF EXISTS "Allow delete orders for authenticated" ON orders;

CREATE POLICY "Allow public read orders" ON orders
FOR SELECT
USING (true);

CREATE POLICY "Allow write orders for authenticated" ON orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow update orders for authenticated" ON orders
FOR UPDATE
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Allow delete orders for authenticated" ON orders
FOR DELETE
TO authenticated
USING (auth.uid() IS NOT NULL);

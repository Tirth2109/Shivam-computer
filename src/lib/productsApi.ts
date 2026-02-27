import { supabase } from "./supabase";
import type { Product } from "../types";

export interface ProductRow {
  id: string;
  name: string;
  category: string;
  category_slug: string;
  brand: string | null;
  price: number;
  mrp: number | null;
  discount_percent: number | null;
  stock: number;
  in_stock: boolean;
  image: string;
  specs: string[];
  rating: number | null;
  review_count: number | null;
  warranty: string | null;
  purpose: string | null;
  is_custom_build: boolean;
  build_time_days: number | null;
}

function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categorySlug: row.category_slug,
    brand: row.brand ?? undefined,
    price: row.price,
    mrp: row.mrp ?? undefined,
    discountPercent: row.discount_percent ?? undefined,
    stock: row.stock,
    inStock: row.in_stock,
    image: row.image,
    specs: Array.isArray(row.specs) ? row.specs : [],
    rating: row.rating ?? undefined,
    reviewCount: row.review_count ?? undefined,
    warranty: row.warranty ?? undefined,
    purpose: row.purpose as Product["purpose"] | undefined,
    isCustomBuild: row.is_custom_build,
    buildTimeDays: row.build_time_days ?? undefined,
  };
}

function productToRow(p: Product): Partial<ProductRow> {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    category_slug: p.categorySlug,
    brand: p.brand ?? null,
    price: p.price,
    mrp: p.mrp ?? null,
    discount_percent: p.discountPercent ?? null,
    stock: p.stock,
    in_stock: p.inStock,
    image: p.image,
    specs: p.specs ?? [],
    rating: p.rating ?? null,
    review_count: p.reviewCount ?? null,
    warranty: p.warranty ?? null,
    purpose: p.purpose ?? null,
    is_custom_build: p.isCustomBuild ?? false,
    build_time_days: p.buildTimeDays ?? null,
  };
}

export async function fetchProducts(): Promise<Product[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from("products").select("*").order("id");
  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}

export async function addProductToSupabase(product: Product): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("products").insert(productToRow(product) as ProductRow);
  if (error) throw error;
}

export async function updateProductInSupabase(id: string, updates: Partial<Product>): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const row: Record<string, unknown> = {};
  if (updates.name != null) row.name = updates.name;
  if (updates.category != null) row.category = updates.category;
  if (updates.categorySlug != null) row.category_slug = updates.categorySlug;
  if (updates.brand != null) row.brand = updates.brand;
  if (updates.price != null) row.price = updates.price;
  if (updates.mrp != null) row.mrp = updates.mrp;
  if (updates.discountPercent != null) row.discount_percent = updates.discountPercent;
  if (updates.stock != null) row.stock = updates.stock;
  if (updates.inStock != null) row.in_stock = updates.inStock;
  if (updates.image != null) row.image = updates.image;
  if (updates.specs != null) row.specs = updates.specs;
  if (updates.rating != null) row.rating = updates.rating;
  if (updates.reviewCount != null) row.review_count = updates.reviewCount;
  if (updates.warranty != null) row.warranty = updates.warranty;
  if (updates.purpose != null) row.purpose = updates.purpose;
  if (updates.isCustomBuild != null) row.is_custom_build = updates.isCustomBuild;
  if (updates.buildTimeDays != null) row.build_time_days = updates.buildTimeDays;
  row.updated_at = new Date().toISOString();
  const { error } = await supabase.from("products").update(row).eq("id", id);
  if (error) throw error;
}

export async function deleteProductFromSupabase(id: string): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function seedProducts(products: Product[]): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const rows = products.map((p) => productToRow(p) as ProductRow);
  const { error } = await supabase.from("products").upsert(rows, { onConflict: "id" });
  if (error) throw error;
}

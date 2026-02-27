export interface Product {
  id: string;
  name: string;
  category: string;
  categorySlug: string;
  brand?: string;
  price: number;
  mrp?: number;
  discountPercent?: number;
  stock: number;
  inStock: boolean;
  image: string;
  images?: string[];
  specs: string[];
  rating?: number;
  reviewCount?: number;
  warranty?: string;
  whatsInBox?: string[];
  purpose?: "gaming" | "office" | "editing" | "student" | "general";
  isCustomBuild?: boolean;
  buildTimeDays?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface Order {
  id: string;
  productName: string;
  placedAt: string;
  status: "pending" | "shipped" | "fulfilled";
}

export interface User {
  username: string;
  password: string;
  role: string;
  fullName: string;
}

export interface AutomationLogEntry {
  message: string;
  timestamp: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SortOption =
  | "relevance"
  | "price-low"
  | "price-high"
  | "newest"
  | "rating";

export interface FilterState {
  brands: string[];
  priceMin?: number;
  priceMax?: number;
  rating?: number;
  inStockOnly: boolean;
  purpose?: string;
  processor?: string;
  ram?: string;
  storage?: string;
}

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

export type OrderStatus = "pending" | "shipped" | "fulfilled";
export type OrderSource = "checkout" | "simulate";
export type PaymentMethod = "cod" | "upi" | "card" | "netbanking" | "unknown";

export interface OrderCustomer {
  name: string;
  phone: string;
  email: string;
}

export interface OrderShippingAddress {
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: string;
  placedAt: string;
  status: OrderStatus;
  source: OrderSource;
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  grandTotal: number;
}

export interface User {
  username?: string;
  password?: string;
  role: string;
  fullName?: string;
  title?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  phone?: string;
  email?: string;
  dob?: string;
  anniversary?: string;
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

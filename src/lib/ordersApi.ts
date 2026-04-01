import { supabase } from "./supabase";
import type {
  Order,
  OrderCustomer,
  OrderItem,
  OrderShippingAddress,
  OrderSource,
  OrderStatus,
  PaymentMethod,
} from "../types";

interface OrderRow {
  id: string;
  placed_at: string;
  status: string;
  source: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address_line: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: string;
  items: unknown;
  subtotal: number;
  shipping_charge: number;
  grand_total: number;
  created_at?: string;
  updated_at?: string;
}

const VALID_STATUS: OrderStatus[] = ["pending", "shipped", "fulfilled"];
const VALID_SOURCE: OrderSource[] = ["checkout", "simulate"];
const VALID_PAYMENT: PaymentMethod[] = ["cod", "upi", "card", "netbanking", "unknown"];

function toOrderStatus(value: unknown): OrderStatus {
  return VALID_STATUS.includes(value as OrderStatus) ? (value as OrderStatus) : "pending";
}

function toOrderSource(value: unknown): OrderSource {
  return VALID_SOURCE.includes(value as OrderSource) ? (value as OrderSource) : "simulate";
}

function toPaymentMethod(value: unknown): PaymentMethod {
  return VALID_PAYMENT.includes(value as PaymentMethod)
    ? (value as PaymentMethod)
    : "unknown";
}

function toItems(value: unknown): OrderItem[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item): OrderItem | null => {
      if (!item || typeof item !== "object") return null;
      const source = item as Record<string, unknown>;
      const productId =
        typeof source.productId === "string" && source.productId.trim()
          ? source.productId.trim()
          : "unknown-product";
      const productName =
        typeof source.productName === "string" && source.productName.trim()
          ? source.productName.trim()
          : "Unknown product";
      const unitPrice = Number(source.unitPrice);
      const quantity = Number(source.quantity);
      const lineTotal = Number(source.lineTotal);
      return {
        productId,
        productName,
        unitPrice: Number.isFinite(unitPrice) ? unitPrice : 0,
        quantity: Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1,
        lineTotal: Number.isFinite(lineTotal) ? lineTotal : 0,
      };
    })
    .filter((entry): entry is OrderItem => entry !== null);
}

function rowToOrder(row: OrderRow): Order {
  const customer: OrderCustomer = {
    name: row.customer_name ?? "",
    phone: row.customer_phone ?? "",
    email: row.customer_email ?? "",
  };
  const shippingAddress: OrderShippingAddress = {
    addressLine: row.address_line ?? "",
    city: row.city ?? "",
    state: row.state ?? "",
    pincode: row.pincode ?? "",
  };
  const items = toItems(row.items);
  const subtotal = Number(row.subtotal);
  const shippingCharge = Number(row.shipping_charge);
  const grandTotal = Number(row.grand_total);

  return {
    id: row.id,
    placedAt: row.placed_at,
    status: toOrderStatus(row.status),
    source: toOrderSource(row.source),
    customer,
    shippingAddress,
    paymentMethod: toPaymentMethod(row.payment_method),
    items,
    subtotal: Number.isFinite(subtotal) ? subtotal : 0,
    shippingCharge: Number.isFinite(shippingCharge) ? shippingCharge : 0,
    grandTotal: Number.isFinite(grandTotal) ? grandTotal : 0,
  };
}

function orderToRow(order: Order): OrderRow {
  return {
    id: order.id,
    placed_at: order.placedAt,
    status: order.status,
    source: order.source,
    customer_name: order.customer.name,
    customer_phone: order.customer.phone,
    customer_email: order.customer.email,
    address_line: order.shippingAddress.addressLine,
    city: order.shippingAddress.city,
    state: order.shippingAddress.state,
    pincode: order.shippingAddress.pincode,
    payment_method: order.paymentMethod,
    items: order.items,
    subtotal: order.subtotal,
    shipping_charge: order.shippingCharge,
    grand_total: order.grandTotal,
    updated_at: new Date().toISOString(),
  };
}

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("placed_at", { ascending: false });
  if (error) throw error;
  return ((data ?? []) as OrderRow[]).map(rowToOrder);
}

export async function upsertOrderInSupabase(order: Order): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const row = orderToRow(order);
  const { error } = await supabase
    .from("orders")
    .upsert(row, { onConflict: "id" });
  if (error) throw error;
}

export async function updateOrderStatusInSupabase(
  id: string,
  status: OrderStatus
): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function clearOrdersInSupabase(): Promise<void> {
  if (!supabase) throw new Error("Supabase not configured");
  const { error } = await supabase.from("orders").delete().neq("id", "");
  if (error) throw error;
}

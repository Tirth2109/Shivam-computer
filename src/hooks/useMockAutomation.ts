import { useCallback, useEffect, useState } from "react";
import {
  clearOrdersInSupabase,
  fetchOrdersFromSupabase,
  updateOrderStatusInSupabase,
  upsertOrderInSupabase,
} from "../lib/ordersApi";
import { isSupabaseConfigured } from "../lib/supabase";
import type {
  AutomationLogEntry,
  Order,
  OrderCustomer,
  OrderItem,
  OrderShippingAddress,
  OrderStatus,
  PaymentMethod,
  Product,
} from "../types";

const ORDERS_KEY = "summitMockOrders";
const LOG_KEY = "summitAutomationLog";
const RUNS_KEY = "summitAutomationRuns";

const VALID_ORDER_STATUS: OrderStatus[] = ["pending", "shipped", "fulfilled"];
const VALID_PAYMENT_METHODS: PaymentMethod[] = [
  "cod",
  "upi",
  "card",
  "netbanking",
  "unknown",
];

export interface CheckoutOrderInput {
  customer: OrderCustomer;
  shippingAddress: OrderShippingAddress;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  subtotal: number;
  shippingCharge: number;
  grandTotal: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const normalizeStatus = (value: unknown): OrderStatus =>
  VALID_ORDER_STATUS.includes(value as OrderStatus)
    ? (value as OrderStatus)
    : "pending";

const normalizePaymentMethod = (value: unknown): PaymentMethod =>
  VALID_PAYMENT_METHODS.includes(value as PaymentMethod)
    ? (value as PaymentMethod)
    : "unknown";

const normalizeNumber = (value: unknown, fallback = 0): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeIsoDate = (value: unknown): string => {
  if (typeof value === "string" && !Number.isNaN(Date.parse(value))) {
    return new Date(value).toISOString();
  }
  return new Date().toISOString();
};

const normalizeOrderItems = (
  value: unknown,
  fallbackProductName = "Legacy product"
): OrderItem[] => {
  if (!Array.isArray(value)) {
    return [
      {
        productId: "legacy-item",
        productName: fallbackProductName,
        unitPrice: 0,
        quantity: 1,
        lineTotal: 0,
      },
    ];
  }

  const items = value
    .map((raw): OrderItem | null => {
      if (!isRecord(raw)) return null;
      const productName =
        typeof raw.productName === "string" && raw.productName.trim()
          ? raw.productName.trim()
          : fallbackProductName;
      const productId =
        typeof raw.productId === "string" && raw.productId.trim()
          ? raw.productId.trim()
          : `legacy-${productName.toLowerCase().replace(/\s+/g, "-")}`;
      const unitPrice = normalizeNumber(raw.unitPrice, 0);
      const quantity = Math.max(1, Math.floor(normalizeNumber(raw.quantity, 1)));
      const lineTotal = normalizeNumber(raw.lineTotal, unitPrice * quantity);
      return {
        productId,
        productName,
        unitPrice,
        quantity,
        lineTotal,
      };
    })
    .filter((entry): entry is OrderItem => entry !== null);

  return items.length > 0
    ? items
    : [
        {
          productId: "legacy-item",
          productName: fallbackProductName,
          unitPrice: 0,
          quantity: 1,
          lineTotal: 0,
        },
      ];
};

const normalizeOrder = (raw: unknown, index = 0): Order | null => {
  if (!isRecord(raw)) return null;

  const legacyProductName =
    typeof raw.productName === "string" && raw.productName.trim()
      ? raw.productName.trim()
      : "Legacy product";
  const id =
    typeof raw.id === "string" && raw.id.trim()
      ? raw.id.trim()
      : `MO-legacy-${Date.now()}-${index}`;
  const status = normalizeStatus(raw.status);
  const placedAt = normalizeIsoDate(raw.placedAt);
  const source =
    raw.source === "checkout" || raw.source === "simulate"
      ? raw.source
      : "simulate";

  const customerRaw = isRecord(raw.customer) ? raw.customer : {};
  const shippingRaw = isRecord(raw.shippingAddress) ? raw.shippingAddress : {};

  const customer: OrderCustomer = {
    name:
      typeof customerRaw.name === "string" && customerRaw.name.trim()
        ? customerRaw.name.trim()
        : "Guest Customer",
    phone:
      typeof customerRaw.phone === "string" && customerRaw.phone.trim()
        ? customerRaw.phone.trim()
        : "-",
    email: typeof customerRaw.email === "string" ? customerRaw.email.trim() : "",
  };

  const shippingAddress: OrderShippingAddress = {
    addressLine:
      typeof shippingRaw.addressLine === "string"
        ? shippingRaw.addressLine.trim()
        : "",
    city: typeof shippingRaw.city === "string" ? shippingRaw.city.trim() : "",
    state: typeof shippingRaw.state === "string" ? shippingRaw.state.trim() : "",
    pincode:
      typeof shippingRaw.pincode === "string" ? shippingRaw.pincode.trim() : "",
  };

  const items = normalizeOrderItems(raw.items, legacyProductName);
  const itemsTotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const subtotal = normalizeNumber(raw.subtotal, itemsTotal);
  const shippingCharge = normalizeNumber(raw.shippingCharge, 0);
  const grandTotal = normalizeNumber(raw.grandTotal, subtotal + shippingCharge);

  return {
    id,
    placedAt,
    status,
    source,
    customer,
    shippingAddress,
    paymentMethod: normalizePaymentMethod(raw.paymentMethod),
    items,
    subtotal,
    shippingCharge,
    grandTotal,
  };
};

const readOrders = (): Order[] => {
  const value = localStorage.getItem(ORDERS_KEY);
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((order, index) => normalizeOrder(order, index))
      .filter((order): order is Order => order !== null);
  } catch (error) {
    console.error("Parse error for orders", error);
    return [];
  }
};

const readLog = (): AutomationLogEntry[] => {
  const value = localStorage.getItem(LOG_KEY);
  if (!value) return [];
  try {
    return JSON.parse(value) as AutomationLogEntry[];
  } catch (error) {
    console.error("Parse error for automation log", error);
    return [];
  }
};

const readRuns = (): number => {
  const value = localStorage.getItem(RUNS_KEY);
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const storeOrders = (orders: Order[]) =>
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

const storeLog = (entries: AutomationLogEntry[]) =>
  localStorage.setItem(LOG_KEY, JSON.stringify(entries));

const storeRuns = (value: number) =>
  localStorage.setItem(RUNS_KEY, value.toString());

const createOrderId = (prefix: "SC" | "MO") =>
  `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")}`;

const buildSimulatedOrder = (product: Product): Order => {
  const quantity = 1;
  const lineTotal = product.price * quantity;
  return {
    id: createOrderId("MO"),
    placedAt: new Date().toISOString(),
    status: "pending",
    source: "simulate",
    customer: {
      name: "Simulated Customer",
      phone: "9999999999",
      email: "simulated@local.test",
    },
    shippingAddress: {
      addressLine: "Demo order generated from storefront/admin simulate flow.",
      city: "Kadi",
      state: "Gujarat",
      pincode: "382715",
    },
    paymentMethod: "cod",
    items: [
      {
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        lineTotal,
      },
    ],
    subtotal: lineTotal,
    shippingCharge: 0,
    grandTotal: lineTotal,
  };
};

const buildCheckoutOrder = (payload: CheckoutOrderInput): Order => ({
  id: createOrderId("SC"),
  placedAt: new Date().toISOString(),
  status: "pending",
  source: "checkout",
  customer: payload.customer,
  shippingAddress: payload.shippingAddress,
  paymentMethod: normalizePaymentMethod(payload.paymentMethod),
  items: payload.items.map((item) => ({
    productId: item.productId,
    productName: item.productName,
    unitPrice: normalizeNumber(item.unitPrice, 0),
    quantity: Math.max(1, Math.floor(normalizeNumber(item.quantity, 1))),
    lineTotal: normalizeNumber(item.lineTotal, 0),
  })),
  subtotal: normalizeNumber(payload.subtotal, 0),
  shippingCharge: normalizeNumber(payload.shippingCharge, 0),
  grandTotal: normalizeNumber(payload.grandTotal, 0),
});

export function useMockAutomation() {
  const useSupabase = isSupabaseConfigured();
  const [orders, setOrders] = useState<Order[]>(() => readOrders());
  const [logs, setLogs] = useState<AutomationLogEntry[]>(() => readLog());
  const [runs, setRuns] = useState<number>(() => readRuns());
  const [ordersLoading, setOrdersLoading] = useState(useSupabase);
  const [orderSyncWarning, setOrderSyncWarning] = useState("");

  const refreshLocal = useCallback(() => {
    setOrders(readOrders());
    setLogs(readLog());
    setRuns(readRuns());
  }, []);

  const logEvent = useCallback((message: string) => {
    const entry: AutomationLogEntry = {
      message,
      timestamp: new Date().toLocaleTimeString(),
    };
    const snapshot = [entry, ...readLog()].slice(0, 12);
    storeLog(snapshot);
    setLogs(snapshot);
  }, []);

  const incrementRuns = useCallback(() => {
    const next = readRuns() + 1;
    storeRuns(next);
    setRuns(next);
    return next;
  }, []);

  const saveOrderLocally = useCallback((order: Order) => {
    const next = [...readOrders().filter((entry) => entry.id !== order.id), order];
    storeOrders(next);
    setOrders(next);
  }, []);

  const syncOrderToSupabase = useCallback(
    async (order: Order) => {
      if (!useSupabase) return;
      try {
        await upsertOrderInSupabase(order);
        setOrderSyncWarning("");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "unknown sync error";
        setOrderSyncWarning(
          `Orders saved locally. Supabase sync failed: ${message}`
        );
      }
    },
    [useSupabase]
  );

  const placeCheckoutOrder = useCallback(
    (payload: CheckoutOrderInput): Order => {
      const order = buildCheckoutOrder(payload);
      saveOrderLocally(order);
      logEvent(`Checkout order ${order.id} from ${order.customer.name}.`);
      incrementRuns();
      void syncOrderToSupabase(order);
      return order;
    },
    [incrementRuns, logEvent, saveOrderLocally, syncOrderToSupabase]
  );

  const simulateOrder = useCallback(
    (product: Product): Order => {
      const order = buildSimulatedOrder(product);
      saveOrderLocally(order);
      logEvent(`Order received for ${product.name}.`);
      incrementRuns();
      void syncOrderToSupabase(order);
      return order;
    },
    [incrementRuns, logEvent, saveOrderLocally, syncOrderToSupabase]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      const next = readOrders().map((entry) =>
        entry.id === orderId ? { ...entry, status } : entry
      );
      storeOrders(next);
      setOrders(next);
      logEvent(`Order ${orderId} marked as ${status}.`);

      if (!useSupabase) return;
      try {
        await updateOrderStatusInSupabase(orderId, status);
        setOrderSyncWarning("");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "unknown sync error";
        setOrderSyncWarning(
          `Status updated locally. Supabase sync failed: ${message}`
        );
      }
    },
    [logEvent, useSupabase]
  );

  const clearOrders = useCallback(async () => {
    localStorage.removeItem(ORDERS_KEY);
    setOrders([]);
    logEvent("Cleared order history.");
    if (!useSupabase) return;
    try {
      await clearOrdersInSupabase();
      setOrderSyncWarning("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "unknown sync error";
      setOrderSyncWarning(
        `Orders cleared locally. Supabase clear failed: ${message}`
      );
    }
  }, [logEvent, useSupabase]);

  const clearAutomationLog = useCallback(() => {
    localStorage.removeItem(LOG_KEY);
    localStorage.removeItem(RUNS_KEY);
    refreshLocal();
  }, [refreshLocal]);

  useEffect(() => {
    refreshLocal();
  }, [refreshLocal]);

  useEffect(() => {
    if (!useSupabase) {
      setOrdersLoading(false);
      return;
    }

    let cancelled = false;
    setOrdersLoading(true);
    fetchOrdersFromSupabase()
      .then((remoteOrders) => {
        if (cancelled) return;
        const localOrders = readOrders();
        const merged = [...remoteOrders];
        const seen = new Set(remoteOrders.map((order) => order.id));
        for (const localOrder of localOrders) {
          if (seen.has(localOrder.id)) continue;
          merged.push(localOrder);
        }
        merged.sort(
          (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
        );
        storeOrders(merged);
        setOrders(merged);
        setOrderSyncWarning("");
      })
      .catch((error) => {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "unknown error";
        setOrderSyncWarning(
          `Using local order data. Supabase fetch failed: ${message}`
        );
        setOrders(readOrders());
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [useSupabase]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (!event.key || [ORDERS_KEY, LOG_KEY, RUNS_KEY].includes(event.key)) {
        refreshLocal();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refreshLocal]);

  return {
    orders,
    ordersLoading,
    orderSyncWarning,
    logs,
    runs,
    simulateOrder,
    placeCheckoutOrder,
    updateOrderStatus,
    logEvent,
    clearOrders,
    clearAutomationLog,
  };
}

import { useCallback, useEffect, useState } from "react";
import type { AutomationLogEntry, Order, Product } from "../types";

const ORDERS_KEY = "summitMockOrders";
const LOG_KEY = "summitAutomationLog";
const RUNS_KEY = "summitAutomationRuns";

const readOrders = (): Order[] => {
  const value = localStorage.getItem(ORDERS_KEY);
  if (!value) return [];
  try {
    return JSON.parse(value) as Order[];
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

const buildOrder = (product: Product): Order => ({
  id: `MO-${Date.now()}`,
  productName: product.name,
  placedAt: new Date().toISOString(),
  status: "pending"
});

const storeOrders = (orders: Order[]) =>
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

const storeLog = (entries: AutomationLogEntry[]) =>
  localStorage.setItem(LOG_KEY, JSON.stringify(entries));

const storeRuns = (value: number) =>
  localStorage.setItem(RUNS_KEY, value.toString());

export function useMockAutomation() {
  const [orders, setOrders] = useState<Order[]>(() => readOrders());
  const [logs, setLogs] = useState<AutomationLogEntry[]>(() => readLog());
  const [runs, setRuns] = useState<number>(() => readRuns());

  const refresh = useCallback(() => {
    setOrders(readOrders());
    setLogs(readLog());
    setRuns(readRuns());
  }, []);

  const logEvent = useCallback((message: string) => {
    const entry: AutomationLogEntry = {
      message,
      timestamp: new Date().toLocaleTimeString()
    };
    const snapshot = [entry, ...readLog()].slice(0, 8);
    storeLog(snapshot);
    setLogs(snapshot);
  }, []);

  const incrementRuns = useCallback(() => {
    const next = readRuns() + 1;
    storeRuns(next);
    setRuns(next);
    return next;
  }, []);

  const simulateOrder = useCallback(
    (product: Product): Order => {
      const order = buildOrder(product);
      const next = [...readOrders(), order];
      storeOrders(next);
      setOrders(next);
      logEvent(`Order received for ${product.name}.`);
      incrementRuns();
      return order;
    },
    [incrementRuns, logEvent]
  );

  const clearOrders = useCallback(() => {
    localStorage.removeItem(ORDERS_KEY);
    refresh();
    logEvent("Cleared mock order history.");
  }, [logEvent, refresh]);

  const clearAutomationLog = useCallback(() => {
    localStorage.removeItem(LOG_KEY);
    localStorage.removeItem(RUNS_KEY);
    refresh();
  }, [refresh]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    orders,
    logs,
    runs,
    simulateOrder,
    logEvent,
    clearOrders,
    clearAutomationLog
  };
}

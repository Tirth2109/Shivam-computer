import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import AdminProductForm from "../components/AdminProductForm";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";
import { useMockAutomation } from "../hooks/useMockAutomation";
import type { Order, OrderStatus, Product } from "../types";

const CAROUSEL_SIZE = 5;

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefault,
    carouselProductIds,
    saveCarouselProductIds,
    resetCarouselToDefault,
    loading,
    error,
    useSupabase,
  } = useProducts();

  const {
    orders,
    ordersLoading,
    orderSyncWarning,
    logs,
    runs,
    simulateOrder,
    updateOrderStatus,
    clearOrders,
    clearAutomationLog,
  } = useMockAutomation();

  const { user, loading: authLoading } = useAuth();

  const [activeTab, setActiveTab] = useState<
    "overview" | "orders" | "products" | "carousel"
  >("overview");
  const [productSearch, setProductSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [carouselSearch, setCarouselSearch] = useState("");
  const [carouselDraftIds, setCarouselDraftIds] = useState<string[]>([]);
  const [carouselStatus, setCarouselStatus] = useState("");
  const [carouselStatusColor, setCarouselStatusColor] = useState("#a8b6ca");
  const [carouselBusy, setCarouselBusy] = useState(false);
  const [orderSearch, setOrderSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState<"all" | OrderStatus>("all");
  const [orderSourceFilter, setOrderSourceFilter] = useState<"all" | "checkout" | "simulate">("all");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrderStatus, setSelectedOrderStatus] = useState<OrderStatus>("pending");
  const [statusUpdateBusy, setStatusUpdateBusy] = useState(false);
  const [orderActionStatus, setOrderActionStatus] = useState("");
  const [orderActionColor, setOrderActionColor] = useState("#a8b6ca");

  const formatOrderProducts = (order: Order, limit = 2) => {
    const labels = order.items.map((item) => `${item.productName} x${item.quantity}`);
    if (labels.length <= limit) return labels.join(", ");
    return `${labels.slice(0, limit).join(", ")} +${labels.length - limit} more`;
  };

  const lowStockCount = useMemo(
    () => products.filter((item) => item.stock < 10).length,
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (!productSearch.trim()) return products;
    const q = productSearch.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        p.categorySlug.toLowerCase().includes(q)
    );
  }, [products, productSearch]);

  const productById = useMemo(
    () => new Map(products.map((p) => [p.id, p])),
    [products]
  );

  const fallbackCarouselIds = useMemo(() => {
    const ids: string[] = [];
    const seen = new Set<string>();
    const push = (id: string) => {
      if (seen.has(id)) return;
      seen.add(id);
      ids.push(id);
    };

    for (const p of products) {
      if (p.categorySlug === "laptops" || p.categorySlug === "headphones") {
        push(p.id);
      }
    }
    for (const p of products) {
      push(p.id);
    }

    return ids;
  }, [products]);

  const resolvedCarouselIds = useMemo(() => {
    const ids: string[] = [];
    const seen = new Set<string>();
    const push = (id: string) => {
      if (seen.has(id) || !productById.has(id)) return;
      seen.add(id);
      ids.push(id);
    };

    for (const id of carouselProductIds) push(id);
    for (const id of fallbackCarouselIds) {
      if (ids.length >= CAROUSEL_SIZE) break;
      push(id);
    }

    return ids.slice(0, CAROUSEL_SIZE);
  }, [carouselProductIds, fallbackCarouselIds, productById]);

  useEffect(() => {
    setCarouselDraftIds(resolvedCarouselIds);
  }, [resolvedCarouselIds]);

  const selectedCarouselProducts = useMemo(
    () => carouselDraftIds.map((id) => productById.get(id)).filter(Boolean) as Product[],
    [carouselDraftIds, productById]
  );

  const availableCarouselProducts = useMemo(() => {
    const selected = new Set(carouselDraftIds);
    const q = carouselSearch.trim().toLowerCase();
    return products.filter((p) => {
      if (selected.has(p.id)) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q))
      );
    });
  }, [carouselDraftIds, carouselSearch, products]);

  const sortedOrders = useMemo(
    () =>
      [...orders].sort(
        (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
      ),
    [orders]
  );

  const recentOrders = useMemo(() => sortedOrders.slice(0, 6), [sortedOrders]);

  const filteredOrders = useMemo(() => {
    const q = orderSearch.trim().toLowerCase();
    return sortedOrders.filter((order) => {
      if (orderStatusFilter !== "all" && order.status !== orderStatusFilter) return false;
      if (orderSourceFilter !== "all" && order.source !== orderSourceFilter) return false;
      if (!q) return true;
      const searchText = [
        order.id,
        order.customer.name,
        order.customer.phone,
        order.customer.email,
        order.shippingAddress.city,
        order.shippingAddress.state,
        order.shippingAddress.pincode,
        ...order.items.map((item) => item.productName),
      ]
        .join(" ")
        .toLowerCase();
      return searchText.includes(q);
    });
  }, [orderSearch, orderSourceFilter, orderStatusFilter, sortedOrders]);

  const selectedOrder = useMemo(
    () => sortedOrders.find((order) => order.id === selectedOrderId) ?? null,
    [selectedOrderId, sortedOrders]
  );

  useEffect(() => {
    if (filteredOrders.length === 0) {
      setSelectedOrderId(null);
      return;
    }
    if (!selectedOrderId || !filteredOrders.some((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(filteredOrders[0].id);
    }
  }, [filteredOrders, selectedOrderId]);

  useEffect(() => {
    if (!selectedOrder) return;
    setSelectedOrderStatus(selectedOrder.status);
  }, [selectedOrder]);

  const tabClass = (active: boolean) =>
    `rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
      active
        ? "border-[#5ec7ff] bg-[#5ec7ff] text-[#050812] shadow-[0_0_0_1px_rgba(94,199,255,0.28)]"
        : "border-[#3b5f86] bg-[#172439] text-[#e6f4ff] hover:border-[#5ec7ff] hover:bg-[#20314b] hover:text-[#ecf3ff]"
    }`;
  const actionButtonClass =
    "rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff] disabled:cursor-not-allowed disabled:opacity-60";
  const actionButtonSmallClass =
    "rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-3 py-1 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff] disabled:cursor-not-allowed disabled:opacity-60";

  if (authLoading) {
    return (
      <>
        {/* Hide global nav bar for admin-only view */}
        <HeaderWithDeals showNav={false} />
        <main className="flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-6 text-center">
            <h1 className="text-2xl font-semibold text-[#ecf3ff]">Loading…</h1>
            <p className="mt-2 text-sm text-[#a8b6ca]">Checking your session.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <HeaderWithDeals showNav={false} />
        <main className="flex min-h-[60vh] items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-6 text-center">
            <h1 className="text-2xl font-semibold text-[#ecf3ff]">Access restricted</h1>
            <p className="mt-2 text-sm text-[#a8b6ca]">Please sign in before visiting the admin dashboard.</p>
            <Link
              className="mt-4 inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
              to="/login"
            >
              Go to login
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleSaveProduct = async (p: Product) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, p);
        setEditingProduct(null);
      } else {
        await addProduct(p);
        setShowAddForm(false);
      }
    } catch {
      // Error shown via useProducts().error
    }
  };

  const handleDelete = async (id: string) => {
    if (deleteConfirm === id) {
      try {
        await deleteProduct(id);
        setDeleteConfirm(null);
        setEditingProduct(null);
      } catch {
        // Error shown via useProducts().error
      }
    } else {
      setDeleteConfirm(id);
    }
  };

  const addCarouselProduct = (id: string) => {
    setCarouselStatus("");
    setCarouselDraftIds((prev) => {
      if (prev.includes(id) || prev.length >= CAROUSEL_SIZE) return prev;
      return [...prev, id];
    });
  };

  const removeCarouselProduct = (index: number) => {
    setCarouselStatus("");
    setCarouselDraftIds((prev) => prev.filter((_, i) => i !== index));
  };

  const moveCarouselProduct = (index: number, direction: -1 | 1) => {
    setCarouselStatus("");
    setCarouselDraftIds((prev) => {
      const target = index + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSaveCarousel = async () => {
    if (carouselDraftIds.length !== CAROUSEL_SIZE) {
      setCarouselStatusColor("#f87171");
      setCarouselStatus("Please select exactly 5 products before saving.");
      return;
    }
    setCarouselBusy(true);
    try {
      await saveCarouselProductIds(carouselDraftIds);
      setCarouselStatusColor("#45d39c");
      setCarouselStatus("Carousel products saved successfully.");
    } catch (e) {
      setCarouselStatusColor("#f87171");
      setCarouselStatus(
        e instanceof Error ? e.message : "Failed to save carousel products."
      );
    } finally {
      setCarouselBusy(false);
    }
  };

  const handleResetCarousel = async () => {
    setCarouselBusy(true);
    try {
      await resetCarouselToDefault();
      setCarouselStatusColor("#45d39c");
      setCarouselStatus("Carousel reset to automatic picks.");
    } catch (e) {
      setCarouselStatusColor("#f87171");
      setCarouselStatus(
        e instanceof Error ? e.message : "Failed to reset carousel products."
      );
    } finally {
      setCarouselBusy(false);
    }
  };

  const handleUpdateSelectedOrderStatus = async () => {
    if (!selectedOrder) return;
    if (selectedOrder.status === selectedOrderStatus) return;
    setStatusUpdateBusy(true);
    try {
      await updateOrderStatus(selectedOrder.id, selectedOrderStatus);
      setOrderActionColor("#45d39c");
      setOrderActionStatus(`Updated ${selectedOrder.id} to ${selectedOrderStatus}.`);
    } catch (error) {
      setOrderActionColor("#f87171");
      setOrderActionStatus(
        error instanceof Error
          ? error.message
          : "Failed to update order status."
      );
    } finally {
      setStatusUpdateBusy(false);
    }
  };

  const statusBadgeClass = (status: OrderStatus) => {
    if (status === "fulfilled") {
      return "border-[#3fb95066] bg-[#3fb9501f] text-[#65f0a4]";
    }
    if (status === "shipped") {
      return "border-[#fbbf2466] bg-[#fbbf241a] text-[#fcd34d]";
    }
    return "border-[#5ec7ff66] bg-[#5ec7ff1a] text-[#b8e6ff]";
  };

  return (
    <>
      <HeaderWithDeals showNav={false} />
      <main className="mx-auto w-full max-w-7xl px-5 py-10">
        <div className="mb-6 inline-flex flex-wrap gap-2 rounded-2xl border border-[#2a3f5d] bg-[#0f1625]/95 p-2 shadow-[0_8px_24px_rgba(5,8,18,0.4)]">
          <button
            type="button"
            className={tabClass(activeTab === "overview")}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={tabClass(activeTab === "products")}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
          <button
            type="button"
            className={tabClass(activeTab === "orders")}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
          <button
            type="button"
            className={tabClass(activeTab === "carousel")}
            onClick={() => setActiveTab("carousel")}
          >
            Carousel
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4">
                <p className="text-sm text-[#a8b6ca]">Products live</p>
                <h2 className="mt-1 text-3xl font-bold text-[#ecf3ff]">{products.length}</h2>
              </article>
              <article className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4">
                <p className="text-sm text-[#a8b6ca]">Active orders</p>
                <h2 className="mt-1 text-3xl font-bold text-[#ecf3ff]">{orders.length}</h2>
              </article>
              <article className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4">
                <p className="text-sm text-[#a8b6ca]">Low-stock alerts</p>
                <h2 className="mt-1 text-3xl font-bold text-[#ecf3ff]">{lowStockCount}</h2>
              </article>
              <article className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4">
                <p className="text-sm text-[#a8b6ca]">Automation runs</p>
                <h2 className="mt-1 text-3xl font-bold text-[#ecf3ff]">{runs}</h2>
              </article>
            </section>

            <section className="mb-6 rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-[#ecf3ff]">Recent orders</h3>
                <p className="mt-1 text-sm text-[#a8b6ca]">
                  Latest checkout and simulated orders. Open Orders tab for complete details.
                </p>
                {orderSyncWarning && (
                  <p className="mt-2 text-sm font-semibold text-[#fbbf24]">{orderSyncWarning}</p>
                )}
              </div>
              <div id="order-feed" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {ordersLoading ? (
                  <p className="text-sm text-[#a8b6ca]">Loading orders...</p>
                ) : recentOrders.length === 0 ? (
                  <p className="text-sm text-[#a8b6ca]">
                    No orders yet. Place an order from checkout or use simulate.
                  </p>
                ) : (
                  recentOrders.map((order) => (
                    <div className="rounded-lg border border-[#2a3f5d] bg-[#0f1625] p-3" key={order.id}>
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-sm text-[#ecf3ff]">{order.id}</strong>
                        <span
                          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${statusBadgeClass(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-[#d5deec]">{order.customer.name}</p>
                      <p className="text-xs text-[#a8b6ca]">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p className="mt-1 text-xs text-[#a8b6ca]">
                        {order.items.length} item(s) · ₹
                        {order.grandTotal.toLocaleString("en-IN")} · {order.source}
                      </p>
                      <p className="text-xs text-[#9fb2c9]">{formatOrderProducts(order, 1)}</p>
                      <p className="text-xs text-[#a8b6ca]">
                        {new Date(order.placedAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
              <div>
                <h3 className="text-xl font-semibold text-[#ecf3ff]">Automation queue</h3>
                <ul id="automation-log" className="mt-3 space-y-1 text-sm text-[#d5deec]">
                  {logs.length === 0 ? (
                    <li className="text-sm text-[#a8b6ca]">No automation events yet.</li>
                  ) : (
                    logs.map((entry, index) => (
                      <li key={`${entry.timestamp}-${index}`}>
                        {entry.timestamp} · {entry.message}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  id="simulate-order"
                  className={actionButtonClass}
                  type="button"
                  onClick={() => {
                    const selection =
                      products[Math.floor(Math.random() * products.length)];
                    if (selection) simulateOrder(selection);
                  }}
                >
                  Simulate order
                </button>
                <button
                  id="clear-orders"
                  className={actionButtonClass}
                  type="button"
                  onClick={clearOrders}
                >
                  Clear mock orders
                </button>
                <button
                  type="button"
                  className={actionButtonClass}
                  onClick={clearAutomationLog}
                >
                  Reset automation log
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === "orders" && (
          <section className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-[#ecf3ff]">Order management</h2>
              <p className="mt-1 text-sm text-[#a8b6ca]">
                View complete customer order details and update delivery status.
              </p>
              {orderSyncWarning && (
                <p className="mt-2 text-sm font-semibold text-[#fbbf24]">{orderSyncWarning}</p>
              )}
              {orderActionStatus && (
                <p className="mt-2 text-sm font-semibold" style={{ color: orderActionColor }}>
                  {orderActionStatus}
                </p>
              )}
            </div>

            <div className="mb-4 grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_auto]">
              <input
                type="search"
                className="rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                placeholder="Search by order id, customer, phone, city, item..."
                value={orderSearch}
                onChange={(event) => setOrderSearch(event.target.value)}
              />
              <select
                className="rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                value={orderStatusFilter}
                onChange={(event) =>
                  setOrderStatusFilter(event.target.value as "all" | OrderStatus)
                }
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="fulfilled">Fulfilled</option>
              </select>
              <select
                className="rounded-lg border border-[#2a3f5d] bg-[#0f1625] px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                value={orderSourceFilter}
                onChange={(event) =>
                  setOrderSourceFilter(
                    event.target.value as "all" | "checkout" | "simulate"
                  )
                }
              >
                <option value="all">All sources</option>
                <option value="checkout">Checkout</option>
                <option value="simulate">Simulate</option>
              </select>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_1fr]">
              <div className="overflow-x-auto rounded-xl border border-[#2a3f5d]">
                {ordersLoading ? (
                  <p className="p-4 text-sm text-[#a8b6ca]">Loading orders...</p>
                ) : filteredOrders.length === 0 ? (
                  <p className="p-4 text-sm text-[#a8b6ca]">No orders match your filters.</p>
                ) : (
                  <table className="w-full min-w-[920px] text-sm">
                    <thead className="bg-[#0f1625] text-left text-[#ecf3ff]">
                      <tr>
                        <th className="px-3 py-2">Order ID</th>
                        <th className="px-3 py-2">Customer</th>
                        <th className="px-3 py-2">Phone</th>
                        <th className="px-3 py-2">City</th>
                        <th className="px-3 py-2">Products</th>
                        <th className="px-3 py-2">Total</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Placed At</th>
                        <th className="px-3 py-2">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => {
                        const isSelected = selectedOrderId === order.id;
                        return (
                          <tr
                            key={order.id}
                            className={`cursor-pointer border-t border-[#2a3f5d] text-[#d5deec] ${
                              isSelected ? "bg-[#18253a]" : "hover:bg-[#152238]/45"
                            }`}
                            onClick={() => setSelectedOrderId(order.id)}
                          >
                            <td className="px-3 py-2 font-semibold text-[#ecf3ff]">{order.id}</td>
                            <td className="px-3 py-2">{order.customer.name}</td>
                            <td className="px-3 py-2">{order.customer.phone || "—"}</td>
                            <td className="px-3 py-2">{order.shippingAddress.city || "—"}</td>
                            <td
                              className="max-w-[260px] truncate px-3 py-2 text-[#c7d7ea]"
                              title={order.items.map((item) => `${item.productName} x${item.quantity}`).join(", ")}
                            >
                              {formatOrderProducts(order)}
                            </td>
                            <td className="px-3 py-2">₹{order.grandTotal.toLocaleString("en-IN")}</td>
                            <td className="px-3 py-2">
                              <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${statusBadgeClass(order.status)}`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="px-3 py-2">{new Date(order.placedAt).toLocaleString()}</td>
                            <td className="px-3 py-2">{order.source}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <aside className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-4">
                {!selectedOrder ? (
                  <p className="text-sm text-[#a8b6ca]">Select an order to view details.</p>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-[#ecf3ff]">{selectedOrder.id}</h3>
                      <p className="text-xs text-[#a8b6ca]">
                        Placed: {new Date(selectedOrder.placedAt).toLocaleString()}
                      </p>
                      <p className="mt-1 text-xs text-[#a8b6ca]">
                        Source: {selectedOrder.source} · Payment:{" "}
                        {selectedOrder.paymentMethod.toUpperCase()}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#2a3f5d] bg-[#111b2c] p-3">
                      <h4 className="text-sm font-semibold text-[#ecf3ff]">Customer</h4>
                      <p className="mt-1 text-sm text-[#d5deec]">{selectedOrder.customer.name}</p>
                      <p className="text-xs text-[#a8b6ca]">{selectedOrder.customer.phone || "No phone"}</p>
                      <p className="text-xs text-[#a8b6ca]">{selectedOrder.customer.email || "No email"}</p>
                    </div>

                    <div className="rounded-lg border border-[#2a3f5d] bg-[#111b2c] p-3">
                      <h4 className="text-sm font-semibold text-[#ecf3ff]">Shipping address</h4>
                      <p className="mt-1 text-sm text-[#d5deec]">
                        {selectedOrder.shippingAddress.addressLine || "—"}
                      </p>
                      <p className="text-xs text-[#a8b6ca]">
                        {selectedOrder.shippingAddress.city || "—"},{" "}
                        {selectedOrder.shippingAddress.state || "—"}{" "}
                        {selectedOrder.shippingAddress.pincode || "—"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-[#2a3f5d] bg-[#111b2c] p-3">
                      <h4 className="text-sm font-semibold text-[#ecf3ff]">Items</h4>
                      <ul className="mt-2 space-y-2">
                        {selectedOrder.items.map((item, index) => (
                          <li key={`${item.productId}-${index}`} className="text-sm text-[#d5deec]">
                            <div className="flex items-start justify-between gap-2">
                              <span className="flex-1">{item.productName}</span>
                              <span className="text-xs text-[#a8b6ca]">x{item.quantity}</span>
                            </div>
                            <div className="text-xs text-[#a8b6ca]">
                              ₹{item.unitPrice.toLocaleString("en-IN")} each · ₹
                              {item.lineTotal.toLocaleString("en-IN")}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-lg border border-[#2a3f5d] bg-[#111b2c] p-3 text-sm">
                      <p className="flex justify-between text-[#d5deec]">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                      </p>
                      <p className="mt-1 flex justify-between text-[#d5deec]">
                        <span>Shipping</span>
                        <span>₹{selectedOrder.shippingCharge.toLocaleString("en-IN")}</span>
                      </p>
                      <p className="mt-2 flex justify-between font-semibold text-[#ecf3ff]">
                        <span>Grand total</span>
                        <span>₹{selectedOrder.grandTotal.toLocaleString("en-IN")}</span>
                      </p>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-semibold text-[#ecf3ff]">
                        Update status
                      </label>
                      <div className="flex gap-2">
                        <select
                          className="flex-1 rounded-lg border border-[#2a3f5d] bg-[#111b2c] px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                          value={selectedOrderStatus}
                          onChange={(event) =>
                            setSelectedOrderStatus(event.target.value as OrderStatus)
                          }
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="fulfilled">Fulfilled</option>
                        </select>
                        <button
                          type="button"
                          className={actionButtonClass}
                          onClick={handleUpdateSelectedOrderStatus}
                          disabled={
                            statusUpdateBusy || selectedOrder.status === selectedOrderStatus
                          }
                        >
                          {statusUpdateBusy ? "Updating..." : "Update"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </section>
        )}

        {activeTab === "products" && (
          <section className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-[#ecf3ff]">Manage products</h2>
              <p className="mt-1 text-sm text-[#a8b6ca]">
                {useSupabase
                  ? "Products are stored in Supabase. Changes sync across devices."
                  : "Add, edit, or remove products. Changes are saved in this browser (localStorage)."}
              </p>
              {loading && <p className="mt-2 text-sm text-[#a8b6ca]">Loading products…</p>}
              {error && (
                <p className="mt-2 text-sm font-semibold text-[#f87171]" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              <input
                type="search"
                className="min-w-[240px] flex-1 rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                placeholder="Search by name, brand, category…"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              <button
                type="button"
                className={actionButtonClass}
                onClick={() => {
                  setShowAddForm(true);
                  setEditingProduct(null);
                }}
              >
                Add product
              </button>
              <button
                type="button"
                className={actionButtonClass}
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset all products to default list? This cannot be undone."
                    )
                  ) {
                    void resetToDefault();
                  }
                }}
              >
                Reset to default
              </button>
            </div>

            {(showAddForm || editingProduct) && (
              <div className="mb-5 rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-4">
                <h3 className="mb-3 text-lg font-semibold text-[#ecf3ff]">{editingProduct ? "Edit product" : "New product"}</h3>
                <AdminProductForm
                  product={editingProduct}
                  onSave={handleSaveProduct}
                  onCancel={() => {
                    setShowAddForm(false);
                    setEditingProduct(null);
                  }}
                />
              </div>
            )}

            <div className="overflow-x-auto">
              {filteredProducts.length === 0 ? (
                <p className="text-sm text-[#a8b6ca]">No products match your search.</p>
              ) : (
                <table className="w-full min-w-[860px] overflow-hidden rounded-xl border border-[#2a3f5d] text-sm">
                  <thead className="bg-[#0f1625] text-left text-[#ecf3ff]">
                    <tr>
                      <th className="px-3 py-2">Image</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2">Category</th>
                      <th className="px-3 py-2">Brand</th>
                      <th className="px-3 py-2">Price</th>
                      <th className="px-3 py-2">Stock</th>
                      <th className="px-3 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="border-t border-[#2a3f5d] text-[#d5deec]">
                        <td className="px-3 py-2">
                          <img
                            src={p.image}
                            alt=""
                            className="h-10 w-10 rounded object-cover"
                          />
                        </td>
                        <td className="px-3 py-2">{p.name}</td>
                        <td className="px-3 py-2">{p.category}</td>
                        <td className="px-3 py-2">{p.brand ?? "—"}</td>
                        <td className="px-3 py-2">₹{p.price.toLocaleString("en-IN")}</td>
                        <td className={`px-3 py-2 ${p.stock < 10 ? "font-semibold text-[#f87171]" : ""}`}>
                          {p.stock}
                        </td>
                        <td className="px-3 py-2">
                          <button
                            type="button"
                            className={`mr-2 ${actionButtonSmallClass}`}
                            onClick={() => {
                              setEditingProduct(p);
                              setShowAddForm(false);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={actionButtonSmallClass}
                            onClick={() => handleDelete(p.id)}
                          >
                            {deleteConfirm === p.id ? "Confirm delete?" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === "carousel" && (
          <section className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
            <div className="mb-5">
              <h2 className="text-2xl font-semibold text-[#ecf3ff]">Homepage carousel manager</h2>
              <p className="mt-1 text-sm text-[#a8b6ca]">
                Select exactly 5 products and set their order for the hero carousel.
              </p>
              <p className="mt-2 text-sm font-semibold text-[#b8e6ff]">
                Selected slots: {carouselDraftIds.length}/{CAROUSEL_SIZE}
              </p>
              {carouselStatus && (
                <p
                  className="mt-2 text-sm font-semibold"
                  style={{ color: carouselStatusColor }}
                  role="status"
                >
                  {carouselStatus}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              <article className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-4">
                <h3 className="text-lg font-semibold text-[#ecf3ff]">Available products</h3>
                <input
                  type="search"
                  className="mt-3 w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                  placeholder="Search product, category, brand..."
                  value={carouselSearch}
                  onChange={(event) => setCarouselSearch(event.target.value)}
                />
                <div className="mt-3 max-h-[520px] space-y-2 overflow-auto pr-1">
                  {availableCarouselProducts.length === 0 ? (
                    <p className="text-sm text-[#a8b6ca]">No more products to add for this search.</p>
                  ) : (
                    availableCarouselProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center gap-3 rounded-lg border border-[#2a3f5d] bg-[#111b2c] p-2"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#ecf3ff]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#a8b6ca]">
                            {product.category} · ₹{product.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <button
                          type="button"
                          className={actionButtonSmallClass}
                          disabled={carouselDraftIds.length >= CAROUSEL_SIZE}
                          onClick={() => addCarouselProduct(product.id)}
                        >
                          Add
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </article>

              <article className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-4">
                <h3 className="text-lg font-semibold text-[#ecf3ff]">Selected order (Slide 1 → 5)</h3>
                <div className="mt-3 space-y-2">
                  {Array.from({ length: CAROUSEL_SIZE }).map((_, index) => {
                    const product = selectedCarouselProducts[index];
                    if (!product) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="rounded-lg border border-dashed border-[#2a3f5d] bg-[#111b2c]/50 px-3 py-4 text-sm text-[#a8b6ca]"
                        >
                          Slot {index + 1}: Empty
                        </div>
                      );
                    }

                    return (
                      <div
                        key={`${product.id}-${index}`}
                        className="flex items-center gap-3 rounded-lg border border-[#2a3f5d] bg-[#111b2c] p-2"
                      >
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#2a3f5d] text-xs font-semibold text-[#d5deec]">
                          {index + 1}
                        </span>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#ecf3ff]">
                            {product.name}
                          </p>
                          <p className="text-xs text-[#a8b6ca]">
                            {product.category} · ₹{product.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            className={actionButtonSmallClass}
                            disabled={index === 0}
                            onClick={() => moveCarouselProduct(index, -1)}
                            aria-label={`Move ${product.name} up`}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className={actionButtonSmallClass}
                            disabled={index === selectedCarouselProducts.length - 1}
                            onClick={() => moveCarouselProduct(index, 1)}
                            aria-label={`Move ${product.name} down`}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className={actionButtonSmallClass}
                            onClick={() => removeCarouselProduct(index)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={actionButtonClass}
                    onClick={handleSaveCarousel}
                    disabled={carouselBusy || carouselDraftIds.length !== CAROUSEL_SIZE}
                  >
                    {carouselBusy ? "Saving..." : "Save carousel"}
                  </button>
                  <button
                    type="button"
                    className={actionButtonClass}
                    onClick={handleResetCarousel}
                    disabled={carouselBusy}
                  >
                    Reset to auto picks
                  </button>
                </div>
              </article>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}

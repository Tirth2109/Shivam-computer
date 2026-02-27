import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import AdminProductForm from "../components/AdminProductForm";
import { useProducts } from "../context/ProductsContext";
import { useMockAutomation } from "../hooks/useMockAutomation";
import type { Product } from "../types";

export default function AdminPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefault,
    loading,
    error,
    useSupabase,
  } = useProducts();
  const { orders, logs, runs, simulateOrder, clearOrders, clearAutomationLog } =
    useMockAutomation();

  const [activeTab, setActiveTab] = useState<"overview" | "products">("overview");
  const [productSearch, setProductSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  const currentUser = useMemo(() => {
    const stored = localStorage.getItem("summitCurrentUser");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as { username: string; role: string };
    } catch {
      return null;
    }
  }, []);

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

  if (!currentUser) {
    return (
      <>
        <HeaderWithDeals />
        <main className="auth-page">
          <div className="auth-card">
            <h1>Access restricted</h1>
            <p>Please log in before visiting the admin dashboard.</p>
            <Link className="btn primary" to="/login">
              Go to login
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderWithDeals />
      <main className="admin-page">
        <div className="admin-tabs">
          <button
            type="button"
            className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            type="button"
            className={`admin-tab ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products
          </button>
        </div>

        {activeTab === "overview" && (
          <>
            <section className="stats-grid">
              <article>
                <p>Products live</p>
                <h2>{products.length}</h2>
              </article>
              <article>
                <p>Active orders</p>
                <h2>{orders.length}</h2>
              </article>
              <article>
                <p>Low-stock alerts</p>
                <h2>{lowStockCount}</h2>
              </article>
              <article>
                <p>Automation runs</p>
                <h2>{runs}</h2>
              </article>
            </section>

            <section className="order-panel">
              <div className="section-heading">
                <h3>Incoming mock orders</h3>
                <p>Orders submitted from the storefront UI push in here automatically.</p>
              </div>
              <div id="order-feed" className="order-feed">
                {orders.length === 0 ? (
                  <p>No orders yet. Trigger one from the storefront.</p>
                ) : (
                  [...orders]
                    .reverse()
                    .map((order) => (
                      <div className="order-card" key={order.id}>
                        <strong>{order.productName}</strong>
                        <p>Status: {order.status}</p>
                        <p>{new Date(order.placedAt).toLocaleString()}</p>
                      </div>
                    ))
                )}
              </div>
            </section>

            <section className="automation-panel">
              <div>
                <h3>Automation queue</h3>
                <ul id="automation-log">
                  {logs.length === 0 ? (
                    <li className="automation-note">No automation events yet.</li>
                  ) : (
                    logs.map((entry, index) => (
                      <li key={`${entry.timestamp}-${index}`}>
                        {entry.timestamp} · {entry.message}
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div className="admin-actions">
                <button
                  id="simulate-order"
                  className="btn outline"
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
                  className="btn secondary"
                  type="button"
                  onClick={clearOrders}
                >
                  Clear mock orders
                </button>
                <button
                  type="button"
                  className="btn outline"
                  onClick={clearAutomationLog}
                >
                  Reset automation log
                </button>
              </div>
            </section>
          </>
        )}

        {activeTab === "products" && (
          <section className="admin-products-section">
            <div className="section-heading">
              <h2>Manage products</h2>
              <p>
                {useSupabase
                  ? "Products are stored in Supabase. Changes sync across devices."
                  : "Add, edit, or remove products. Changes are saved in this browser (localStorage)."}
              </p>
              {loading && <p className="admin-status">Loading products…</p>}
              {error && (
                <p className="admin-error" role="alert">
                  {error}
                </p>
              )}
            </div>

            <div className="admin-products-toolbar">
              <input
                type="search"
                className="admin-product-search"
                placeholder="Search by name, brand, category…"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
              />
              <button
                type="button"
                className="btn primary"
                onClick={() => {
                  setShowAddForm(true);
                  setEditingProduct(null);
                }}
              >
                Add product
              </button>
              <button
                type="button"
                className="btn outline"
                onClick={() => {
                  if (window.confirm("Reset all products to default list? This cannot be undone.")) {
                    void resetToDefault();
                  }
                }}
              >
                Reset to default
              </button>
            </div>

            {(showAddForm || editingProduct) && (
              <div className="admin-form-card">
                <h3>{editingProduct ? "Edit product" : "New product"}</h3>
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

            <div className="admin-product-list">
              {filteredProducts.length === 0 ? (
                <p className="admin-empty">No products match your search.</p>
              ) : (
                <table className="admin-product-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Brand</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <img
                            src={p.image}
                            alt=""
                            className="admin-product-thumb"
                          />
                        </td>
                        <td>{p.name}</td>
                        <td>{p.category}</td>
                        <td>{p.brand ?? "—"}</td>
                        <td>₹{p.price.toLocaleString("en-IN")}</td>
                        <td className={p.stock < 10 ? "low-stock" : ""}>
                          {p.stock}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn outline btn-sm"
                            onClick={() => {
                              setEditingProduct(p);
                              setShowAddForm(false);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn secondary btn-sm"
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
      </main>
      <Footer />
    </>
  );
}

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<"check" | "yes" | "no" | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { products } = useProducts();
  const product = products.find((p) => p.id === id);
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Shivam Computer`;
    }
    return () => { document.title = "Buy Brand New Computers in India | Shivam Computer"; };
  }, [product]);

  if (!product) {
    return (
      <>
        <HeaderWithDeals />
        <main className="section">
          <div className="container">
            <p>Product not found.</p>
            <Link to="/">Back to home</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const checkPincode = () => {
    if (!pincode.trim()) return;
    setPincodeResult("check");
    setTimeout(() => {
      const num = parseInt(pincode.replace(/\D/g, ""), 10);
      setPincodeResult(num >= 380000 && num <= 399999 ? "yes" : "no");
    }, 500);
  };

  return (
    <>
      <HeaderWithDeals />
      <main className="section">
        <div className="container">
          <div className="pdp-layout">
            <div className="pdp-gallery">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="pdp-info">
              <p className="text-muted" style={{ marginBottom: "0.25rem" }}>
                {product.category}
                {product.brand && ` • ${product.brand}`}
              </p>
              <h1>{product.name}</h1>
              {product.rating != null && (
                <p className="text-muted">
                  ★ {product.rating.toFixed(1)}
                  {product.reviewCount != null && ` (${product.reviewCount} reviews)`}
                </p>
              )}
              <div className="pdp-price" style={{ marginTop: "0.5rem" }}>
                <span className="current">₹{product.price.toLocaleString("en-IN")}</span>
                {product.mrp != null && product.mrp > product.price && (
                  <>
                    <span className="mrp">₹{product.mrp.toLocaleString("en-IN")}</span>
                    <span className="discount">
                      {product.discountPercent}% off
                    </span>
                  </>
                )}
              </div>
              <p style={{ marginTop: "0.5rem" }}>
                {product.inStock && product.stock > 0 ? (
                  <span style={{ color: "var(--accent)" }}>In stock ({product.stock} left)</span>
                ) : (
                  <span className="low-stock">Out of stock</span>
                )}
              </p>
              {product.warranty && (
                <p className="text-muted">Warranty: {product.warranty}</p>
              )}

              <div style={{ marginTop: "1rem" }}>
                <label style={{ display: "block", marginBottom: "0.35rem", fontSize: "0.9rem" }}>
                  Check delivery (Pincode)
                </label>
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                  <input
                    type="text"
                    placeholder="Enter pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    style={{
                      padding: "0.5rem 0.75rem",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      width: "140px",
                    }}
                  />
                  <button type="button" className="btn secondary btn-sm" onClick={checkPincode}>
                    Check
                  </button>
                </div>
                {pincodeResult === "yes" && <p style={{ color: "var(--accent)", marginTop: "0.35rem" }}>Delivery available</p>}
                {pincodeResult === "no" && <p style={{ color: "var(--discount)", marginTop: "0.35rem" }}>Enter valid Indian pincode</p>}
              </div>

              {product.isCustomBuild && (
                <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--bg-section)", borderRadius: "var(--radius)" }}>
                  <p style={{ margin: 0, fontWeight: 600 }}>Custom Build</p>
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem", color: "var(--text-muted)" }}>
                    Compatibility guaranteed • Assembled + stress tested • Build time: {product.buildTimeDays ?? 3}–5 days
                  </p>
                </div>
              )}

              <div className="pdp-actions">
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => addToCart(product, quantity)}
                >
                  Add to Cart
                </button>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    addToCart(product, quantity);
                    window.location.href = "/cart";
                  }}
                >
                  Buy Now
                </button>
                <Link to="/wishlist" className="btn outline btn-sm">Wishlist</Link>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <label style={{ fontSize: "0.9rem" }}>Quantity </label>
                <input
                  type="number"
                  min={1}
                  max={product.stock || 10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  style={{
                    width: "60px",
                    marginLeft: "0.5rem",
                    padding: "0.35rem",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                  }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "2rem" }}>
            <h3 style={{ fontFamily: "var(--heading-font)", marginBottom: "0.75rem" }}>Specifications</h3>
            <table className="specs-table">
              <tbody>
                {product.specs.map((spec, i) => (
                  <tr key={i}>
                    <th>Spec</th>
                    <td>{spec}</td>
                  </tr>
                ))}
                {product.warranty && (
                  <tr>
                    <th>Warranty</th>
                    <td>{product.warranty}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {product.whatsInBox && product.whatsInBox.length > 0 && (
            <div style={{ marginTop: "1.5rem" }}>
              <h3 style={{ fontFamily: "var(--heading-font)", marginBottom: "0.75rem" }}>What's in the box</h3>
              <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
                {product.whatsInBox.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--heading-font)", marginBottom: "0.75rem" }}>Similar Products</h3>
            <div className="product-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
              {products
                .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
                .slice(0, 4)
                .map((p) => (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    className="product-card"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="product-card-image">
                      <img src={p.image} alt={p.name} />
                    </div>
                    <div className="product-card-body">
                      <h3>{p.name}</h3>
                      <div className="product-card-price">
                        <span className="current">₹{p.price.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

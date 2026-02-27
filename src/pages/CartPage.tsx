import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, updateQuantity, removeFromCart } = useCart();
  const [coupon, setCoupon] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <>
      <HeaderWithDeals />
      <main className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Shopping Cart</h2>
            <p>{items.length} item(s)</p>
          </div>
          {items.length === 0 ? (
            <p className="text-muted">
              Your cart is empty. <Link to="/">Continue shopping</Link>.
            </p>
          ) : (
            <div className="cart-checkout-layout">
              <div>
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="cart-item">
                    <img src={product.image} alt={product.name} />
                    <div style={{ flex: 1 }}>
                      <Link to={`/product/${product.id}`} style={{ fontWeight: 600 }}>
                        {product.name}
                      </Link>
                      <p className="text-muted" style={{ margin: "0.25rem 0" }}>
                        ₹{product.price.toLocaleString("en-IN")} × {quantity}
                      </p>
                      <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                        <button
                          type="button"
                          className="btn secondary btn-sm"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          −
                        </button>
                        <span style={{ alignSelf: "center" }}>{quantity}</span>
                        <button
                          type="button"
                          className="btn secondary btn-sm"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="btn outline btn-sm"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700 }}>
                      ₹{(product.price * quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: "1rem" }}>
                  <label style={{ display: "block", marginBottom: "0.35rem" }}>Coupon</label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      style={{
                        padding: "0.5rem 0.75rem",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        flex: 1,
                      }}
                    />
                    <button type="button" className="btn secondary btn-sm">Apply</button>
                  </div>
                </div>
              </div>
              <div className="cart-summary">
                <h3 style={{ margin: "0 0 1rem" }}>Order Summary</h3>
                <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.5rem" }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.5rem" }}>
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </p>
                <p style={{ display: "flex", justifyContent: "space-between", margin: "0 0 1rem", fontWeight: 700, fontSize: "1.1rem" }}>
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </p>
                <Link to="/checkout" className="btn primary" style={{ width: "100%", textAlign: "center" }}>
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

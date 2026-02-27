import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const [step, setStep] = useState<"address" | "payment" | "done">("address");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "upi" | "card" | "netbanking">("cod");
  const [orderId, setOrderId] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 99;
  const total = subtotal + shipping;

  const handlePlaceOrder = () => {
    setOrderId(`SC-${Date.now()}`);
    setStep("done");
    clearCart();
  };

  if (items.length === 0 && step !== "done") {
    return (
      <>
        <HeaderWithDeals />
        <main className="section">
          <div className="container">
            <p className="text-muted">Your cart is empty. <Link to="/">Continue shopping</Link>.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (step === "done") {
    return (
      <>
        <HeaderWithDeals />
        <main className="section">
          <div className="container">
            <div className="section-heading">
              <h2>Order Confirmed</h2>
              <p>Thank you for your order.</p>
            </div>
            <div className="cart-summary" style={{ maxWidth: "480px" }}>
              <p><strong>Order ID:</strong> {orderId}</p>
              <p>We'll send updates to your email and phone. You can track your order using this ID.</p>
              <Link to="/" className="btn primary">Continue Shopping</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <HeaderWithDeals />
      <main className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Checkout</h2>
            <p>Delivery across India • Secure payment</p>
          </div>
          <div className="cart-checkout-layout" style={{ gridTemplateColumns: "1fr 340px" }}>
            <div>
              {step === "address" && (
                <div className="checkout-form">
                  <h3 style={{ margin: "0 0 1rem" }}>Shipping Address</h3>
                  <label>Full name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    required
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label>Address *</label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    required
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label>City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label>State *</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <label>Pincode *</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <button
                    type="button"
                    className="btn primary"
                    onClick={() => setStep("payment")}
                  >
                    Continue to Payment
                  </button>
                </div>
              )}
              {step === "payment" && (
                <div className="checkout-form">
                  <h3 style={{ margin: "0 0 1rem" }}>Payment Method</h3>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    Cash on Delivery (COD)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input type="radio" name="pay" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                    UPI (GPay, PhonePe, etc.)
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input type="radio" name="pay" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                    Debit / Credit Card
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                    <input type="radio" name="pay" checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} />
                    Net Banking
                  </label>
                  <p className="text-muted" style={{ fontSize: "0.85rem", marginTop: "0.5rem" }}>
                    Razorpay integration can be added for online payment. COD available for eligible orders.
                  </p>
                  <button type="button" className="btn secondary" onClick={() => setStep("address")}>
                    Back
                  </button>
                  <button type="button" className="btn primary" onClick={handlePlaceOrder}>
                    Place Order
                  </button>
                </div>
              )}
            </div>
            <div className="cart-summary">
              <h3 style={{ margin: "0 0 1rem" }}>Order Summary</h3>
              {items.map(({ product, quantity }) => (
                <p key={product.id} style={{ display: "flex", justifyContent: "space-between", margin: "0 0 0.5rem", fontSize: "0.9rem" }}>
                  <span>{product.name} × {quantity}</span>
                  <span>₹{(product.price * quantity).toLocaleString("en-IN")}</span>
                </p>
              ))}
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0 0", paddingTop: "0.5rem", borderTop: "1px solid var(--border)" }}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0.25rem 0" }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </p>
              <p style={{ display: "flex", justifyContent: "space-between", margin: "0.5rem 0 0", fontWeight: 700, fontSize: "1.1rem" }}>
                <span>Total</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

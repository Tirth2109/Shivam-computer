import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import { useCart } from "../context/CartContext";
import { useMockAutomation } from "../hooks/useMockAutomation";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const { placeCheckoutOrder } = useMockAutomation();
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
  const [formError, setFormError] = useState("");

  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const shipping = subtotal >= 50000 ? 0 : 99;
  const total = subtotal + shipping;
  const fieldClass =
    "w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]";
  const primaryBtn =
    "inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]";
  const secondaryBtn =
    "inline-flex items-center rounded-full border border-[#2a3f5d] px-5 py-2.5 text-sm font-semibold text-[#ecf3ff] transition hover:border-[#5ec7ff] hover:text-[#5ec7ff]";

  const validateShipping = () => {
    if (!name.trim()) return "Please enter full name.";
    if (!phone.trim()) return "Please enter phone number.";
    if (!address.trim()) return "Please enter delivery address.";
    if (!city.trim()) return "Please enter city.";
    if (!state.trim()) return "Please enter state.";
    if (!pincode.trim()) return "Please enter pincode.";
    return "";
  };

  const handlePlaceOrder = () => {
    const validationError = validateShipping();
    if (validationError) {
      setFormError(validationError);
      setStep("address");
      return;
    }

    const order = placeCheckoutOrder({
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
      },
      shippingAddress: {
        addressLine: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
      },
      paymentMethod,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        productName: product.name,
        unitPrice: product.price,
        quantity,
        lineTotal: product.price * quantity,
      })),
      subtotal,
      shippingCharge: shipping,
      grandTotal: total,
    });

    setOrderId(order.id);
    setFormError("");
    setStep("done");
    clearCart();
  };

  if (items.length === 0 && step !== "done") {
    return (
      <>
        <HeaderWithDeals />
        <main className="py-10">
          <div className="mx-auto w-full max-w-6xl px-5">
            <p className="text-sm text-[#a8b6ca]">Your cart is empty. <Link to="/">Continue shopping</Link>.</p>
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
        <main className="py-10">
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#ecf3ff]">Order Confirmed</h2>
              <p className="mt-1 text-sm text-[#a8b6ca]">Thank you for your order.</p>
            </div>
            <div className="max-w-[480px] rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
              <p><strong>Order ID:</strong> {orderId}</p>
              <p className="mt-2 text-sm text-[#a8b6ca]">We'll send updates to your email and phone. You can track your order using this ID.</p>
              <Link to="/" className={`${primaryBtn} mt-4`}>Continue Shopping</Link>
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
      <main className="py-10">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#ecf3ff]">Checkout</h2>
            <p className="mt-1 text-sm text-[#a8b6ca]">Delivery across India • Secure payment</p>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">
            <div>
              {step === "address" && (
                <div className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
                  <h3 className="mb-4 text-lg font-semibold text-[#ecf3ff]">Shipping Address</h3>
                  <label className="mb-1 block text-sm text-[#d5deec]">Full name *</label>
                  <input
                    className={fieldClass}
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label className="mb-1 mt-3 block text-sm text-[#d5deec]">Phone *</label>
                  <input
                    className={fieldClass}
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    required
                  />
                  <label className="mb-1 mt-3 block text-sm text-[#d5deec]">Email</label>
                  <input
                    className={fieldClass}
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="mb-1 mt-3 block text-sm text-[#d5deec]">Address *</label>
                  <textarea
                    className={fieldClass}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    required
                  />
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm text-[#d5deec]">City *</label>
                      <input
                        className={fieldClass}
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm text-[#d5deec]">State *</label>
                      <input
                        className={fieldClass}
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <label className="mb-1 mt-3 block text-sm text-[#d5deec]">Pincode *</label>
                  <input
                    className={fieldClass}
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    required
                  />
                  <button
                    type="button"
                    className={`${primaryBtn} mt-4`}
                    onClick={() => {
                      const validationError = validateShipping();
                      if (validationError) {
                        setFormError(validationError);
                        return;
                      }
                      setFormError("");
                      setStep("payment");
                    }}
                  >
                    Continue to Payment
                  </button>
                  {formError && (
                    <p className="mt-3 text-sm font-semibold text-[#f87171]" role="alert">
                      {formError}
                    </p>
                  )}
                </div>
              )}
              {step === "payment" && (
                <div className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
                  <h3 className="mb-4 text-lg font-semibold text-[#ecf3ff]">Payment Method</h3>
                  <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#d5deec]">
                    <input
                      type="radio"
                      name="pay"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    Cash on Delivery (COD)
                  </label>
                  <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#d5deec]">
                    <input type="radio" name="pay" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} />
                    UPI (GPay, PhonePe, etc.)
                  </label>
                  <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#d5deec]">
                    <input type="radio" name="pay" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} />
                    Debit / Credit Card
                  </label>
                  <label className="mb-2 flex cursor-pointer items-center gap-2 text-sm text-[#d5deec]">
                    <input type="radio" name="pay" checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} />
                    Net Banking
                  </label>
                  <p className="mt-2 text-sm text-[#a8b6ca]">
                    Razorpay integration can be added for online payment. COD available for eligible orders.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className={secondaryBtn} onClick={() => setStep("address")}>
                    Back
                  </button>
                  <button type="button" className={primaryBtn} onClick={handlePlaceOrder}>
                    Place Order
                  </button>
                  </div>
                  {formError && (
                    <p className="mt-3 text-sm font-semibold text-[#f87171]" role="alert">
                      {formError}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="h-fit rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4">
              <h3 className="mb-4 text-lg font-semibold text-[#ecf3ff]">Order Summary</h3>
              {items.map(({ product, quantity }) => (
                <p key={product.id} className="mb-2 flex justify-between text-sm text-[#d5deec]">
                  <span>{product.name} × {quantity}</span>
                  <span>₹{(product.price * quantity).toLocaleString("en-IN")}</span>
                </p>
              ))}
              <p className="mt-3 flex justify-between border-t border-[#2a3f5d] pt-2 text-sm text-[#d5deec]">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </p>
              <p className="my-1 flex justify-between text-sm text-[#d5deec]">
                <span>Shipping</span>
                <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
              </p>
              <p className="mt-2 flex justify-between text-lg font-bold text-[#ecf3ff]">
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

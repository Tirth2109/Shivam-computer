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
      <main className="py-10">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#ecf3ff]">Shopping Cart</h2>
            <p className="mt-1 text-sm text-[#a8b6ca]">{items.length} item(s)</p>
          </div>
          {items.length === 0 ? (
            <p className="text-sm text-[#a8b6ca]">
              Your cart is empty. <Link to="/">Continue shopping</Link>.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
              <div>
                {items.map(({ product, quantity }) => (
                  <div key={product.id} className="mb-3 flex gap-4 rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4">
                    <img src={product.image} alt={product.name} className="h-20 w-20 rounded-lg object-contain bg-[#0f1625] p-2" />
                    <div className="flex-1">
                      <Link to={`/product/${product.id}`} className="font-semibold text-[#ecf3ff]">
                        {product.name}
                      </Link>
                      <p className="my-1 text-sm text-[#a8b6ca]">
                        ₹{product.price.toLocaleString("en-IN")} × {quantity}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-3 py-1.5 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                        >
                          −
                        </button>
                        <span className="self-center text-sm text-[#ecf3ff]">{quantity}</span>
                        <button
                          type="button"
                          className="rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-3 py-1.5 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-3 py-1.5 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                          onClick={() => removeFromCart(product.id)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <div className="text-base font-bold text-[#ecf3ff]">
                      ₹{(product.price * quantity).toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
                <div className="mt-4">
                  <label className="mb-1 block text-sm text-[#d5deec]">Coupon</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                    />
                    <button type="button" className="rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff]">Apply</button>
                  </div>
                </div>
              </div>
              <div className="h-fit rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4">
                <h3 className="mb-4 text-lg font-semibold text-[#ecf3ff]">Order Summary</h3>
                <p className="mb-2 flex justify-between text-sm text-[#d5deec]">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </p>
                <p className="mb-2 flex justify-between text-sm text-[#d5deec]">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </p>
                <p className="mb-4 flex justify-between text-lg font-bold text-[#ecf3ff]">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </p>
                <Link
                  to="/checkout"
                  className="inline-flex w-full items-center justify-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                >
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

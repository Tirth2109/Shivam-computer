import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import WhatsAppFloat from "../components/WhatsAppFloat";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useProducts } from "../context/ProductsContext";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isCartPopped, setIsCartPopped] = useState(false);
  const cartPulseTimerRef = useRef<number | null>(null);

  const { products } = useProducts();
  const product = products.find((p) => p.id === id);

  const specificationRows: Array<{ label: string; value: string }> = [];
  if (product) {
    specificationRows.push({ label: "Category", value: product.category });
    if (product.brand) {
      specificationRows.push({ label: "Brand", value: product.brand });
    }
    if (product.isCustomBuild) {
      specificationRows.push({
        label: "Custom Build",
        value: `Yes${product.buildTimeDays ? ` (${product.buildTimeDays} days build time)` : ""}`,
      });
    }
    if (product.warranty) {
      specificationRows.push({ label: "Warranty", value: product.warranty });
    }
    product.specs.forEach((spec, index) => {
      specificationRows.push({
        label: `Spec ${index + 1}`,
        value: spec,
      });
    });
  }

  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Shivam Computer`;
    }
    return () => { document.title = "Buy Brand New Computers in India | Shivam Computer"; };
  }, [product]);

  useEffect(() => {
    return () => {
      if (cartPulseTimerRef.current != null) {
        window.clearTimeout(cartPulseTimerRef.current);
      }
    };
  }, []);

  if (!product) {
    return (
      <>
        <HeaderWithDeals />
        <main className="py-10">
          <div className="mx-auto w-full max-w-6xl px-5">
            <p className="text-[#ecf3ff]">Product not found.</p>
            <Link to="/" className="mt-2 inline-flex text-[#5ec7ff]">Back to home</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsCartPopped(true);
    if (cartPulseTimerRef.current != null) {
      window.clearTimeout(cartPulseTimerRef.current);
    }
    cartPulseTimerRef.current = window.setTimeout(() => {
      setIsCartPopped(false);
    }, 420);
  };

  return (
    <>
      <HeaderWithDeals />
      <main className="py-10" data-reveal>
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.1fr]">
            <div className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-4">
              <img src={product.image} alt={product.name} className="h-[320px] w-full object-contain" />
            </div>
            <div className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
              <p className="mb-1 text-sm text-[#a8b6ca]">
                {product.category}
                {product.brand && ` • ${product.brand}`}
              </p>
              <h1 className="text-2xl font-semibold text-[#ecf3ff]">{product.name}</h1>
              {product.rating != null && (
                <p className="mt-1 text-sm text-[#a8b6ca]">
                  ★ {product.rating.toFixed(1)}
                  {product.reviewCount != null && ` (${product.reviewCount} reviews)`}
                </p>
              )}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[#ecf3ff]">₹{product.price.toLocaleString("en-IN")}</span>
                {product.mrp != null && product.mrp > product.price && (
                  <>
                    <span className="text-base text-[#a8b6ca] line-through">₹{product.mrp.toLocaleString("en-IN")}</span>
                    <span className="text-sm font-semibold text-[#f85149]">
                      {product.discountPercent}% off
                    </span>
                  </>
                )}
              </div>
              <p className="mt-2 text-sm">
                {product.inStock && product.stock > 0 ? (
                  <span className="font-semibold text-[#3fb950]">In stock ({product.stock} left)</span>
                ) : (
                  <span className="font-semibold text-[#f85149]">Out of stock</span>
                )}
              </p>
              {product.warranty && (
                <p className="mt-1 text-sm text-[#a8b6ca]">Warranty: {product.warranty}</p>
              )}

              {product.isCustomBuild && (
                <div className="mt-4 rounded-xl bg-[#0f1625] p-4">
                  <p className="font-semibold text-[#ecf3ff]">Custom Build</p>
                  <p className="mt-1 text-sm text-[#a8b6ca]">
                    Compatibility guaranteed • Assembled + stress tested • Build time: {product.buildTimeDays ?? 3}–5 days
                  </p>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  className={`rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff] ${isCartPopped ? "motion-safe:animate-[cartButtonPop_0.4s_cubic-bezier(0.22,1,0.36,1)]" : ""}`}
                  onClick={handleAddToCart}
                >
                  {isCartPopped ? "Added!" : "Add to Cart"}
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                >
                  Buy Now
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                  onClick={() => toggleWishlist(product)}
                >
                  {isInWishlist(product.id) ? "Remove Favourite" : "Add Favourite"}
                </button>
              </div>
              <div className="mt-4">
                <label className="text-sm text-[#d5deec]">Quantity </label>
                <input
                  type="number"
                  min={1}
                  max={product.stock || 10}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                  className="ml-2 w-[64px] rounded-lg border border-[#2a3f5d] bg-transparent px-2 py-1 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]"
                />
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="mb-3 text-xl font-semibold text-[#ecf3ff]">Specifications</h3>
            <table className="w-full overflow-hidden rounded-xl border border-[#2a3f5d] text-sm">
              <tbody>
                {specificationRows.map((spec, i) => (
                  <tr key={i} className="border-b border-[#2a3f5d] last:border-b-0">
                    <th className="w-36 bg-[#0f1625] px-3 py-2 text-left font-semibold text-[#ecf3ff]">
                      {spec.label}
                    </th>
                    <td className="px-3 py-2 text-[#d5deec]">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {product.whatsInBox && product.whatsInBox.length > 0 && (
            <div className="mt-6">
              <h3 className="mb-3 text-xl font-semibold text-[#ecf3ff]">What's in the box</h3>
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#d5deec]">
                {product.whatsInBox.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6">
            <h3 className="mb-3 text-xl font-semibold text-[#ecf3ff]">Similar Products</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {products
                .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
                .slice(0, 4)
                .map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    badgeLabel="Similar"
                    showActions={false}
                    showRating={false}
                  />
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

import { useNavigate, Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import type { Product } from "../types";

export default function WishlistPage() {
  const { items, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    navigate("/cart");
  };

  return (
    <>
      <HeaderWithDeals />
      <main className="py-10" data-reveal>
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3" data-reveal style={{ transitionDelay: "40ms" }}>
            <div>
              <h2 className="text-2xl font-semibold text-[#ecf3ff]">My Wishlist</h2>
              <p className="mt-1 text-sm text-[#a8b6ca]">{items.length} saved item(s)</p>
            </div>
            {items.length > 0 && (
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-[#050812] shadow-[0_10px_30px_rgba(248,81,73,0.25)] transition hover:shadow-[0_12px_34px_rgba(248,81,73,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f85149] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b1120]"
                style={{
                  background: "linear-gradient(135deg, #ff7b72 0%, #f85149 48%, #ff9f7a 100%)",
                  border: "1px solid #f98a80"
                }}
                onClick={clearWishlist}
              >
                Clear Wishlist
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-6 text-center">
              <p className="text-sm text-[#a8b6ca]">No favourites yet. Save products using the heart icon on product cards.</p>
              <Link
                to="/"
                className="mt-4 inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  badgeLabel="Favourite"
                  onAddToCart={addToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

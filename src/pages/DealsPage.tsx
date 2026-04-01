import { useNavigate } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

export default function DealsPage() {
  const { addToCart } = useCart();
  const { topDeals } = useProducts();
  const navigate = useNavigate();
  const handleBuyNow = (p: { id: string }) => {
    addToCart(p as any, 1);
    navigate("/cart");
  };
  return (
    <>
      <HeaderWithDeals />
      <main className="py-10" data-reveal>
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mb-6" data-reveal style={{ transitionDelay: "50ms" }}>
            <h2 className="text-2xl font-semibold text-[#ecf3ff]">Top Deals</h2>
            <p className="mt-1 text-sm text-[#a8b6ca]">Best discounts on PCs, components and accessories</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {topDeals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

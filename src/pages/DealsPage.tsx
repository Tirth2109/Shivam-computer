import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

export default function DealsPage() {
  const { addToCart } = useCart();
  const { topDeals } = useProducts();
  const handleBuyNow = (p: { id: string }) => {
    addToCart(p as any, 1);
    window.location.href = "/cart";
  };
  return (
    <>
      <HeaderWithDeals />
      <main className="section">
        <div className="container">
          <div className="section-heading">
            <h2>Top Deals</h2>
            <p>Best discounts on PCs, components and accessories</p>
          </div>
          <div className="product-grid">
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

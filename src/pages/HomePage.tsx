import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import BrandsMarquee from "../components/BrandsMarquee";
import WhatsAppFloat from "../components/WhatsAppFloat";
import { categories } from "../data/categories";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";

const TRUST_ITEMS = [
  { icon: "✅", title: "Genuine & Sealed Products", text: "100% authentic with manufacturer warranty" },
  { icon: "💰", title: "Best Price Guarantee", text: "Competitive prices across India" },
  { icon: "📄", title: "GST Invoice Available", text: "Proper billing for business & personal" },
  { icon: "🚚", title: "Fast Shipping & Safe Packaging", text: "Delivery across India, secure packaging" },
  { icon: "🔄", title: "Easy Replacement Policy", text: "Hassle-free returns within policy" },
  { icon: "🛠️", title: "Expert Technical Support", text: "WhatsApp & call support for builds" },
];

const REVIEWS = [
  { stars: 5, text: "Got my custom gaming PC in 5 days. Build quality and cable management were top notch. Highly recommend!", author: "Rahul M.", verified: true },
  { stars: 5, text: "Best prices on components. Bought RAM and SSD. Genuine products, fast delivery.", author: "Priya S.", verified: true },
  { stars: 5, text: "Custom build support team helped me choose the right parts for my budget. Very satisfied.", author: "Vikram K.", verified: true },
];

export default function HomePage() {
  const [featuredTab, setFeaturedTab] = useState<"bestsellers" | "new" | "deals">("bestsellers");
  const { addToCart } = useCart();
  const { bestSellers, newArrivals, topDeals } = useProducts();
  const navigate = useNavigate();

  const handleBuyNow = (product: { id: string }) => {
    addToCart(product as any, 1);
    navigate("/cart");
  };

  const featuredProducts =
    featuredTab === "bestsellers" ? bestSellers :
    featuredTab === "new" ? newArrivals : topDeals;

  return (
    <>
      <HeaderWithDeals />
      <main>
        {/* Shop by Category */}
        <section className="section section-alt" data-reveal>
          <div className="container">
            <div className="section-heading" data-reveal style={{ transitionDelay: "60ms" }}>
              <h2>Shop by Category</h2>
              <p>Find desktops, components, laptops, and more</p>
            </div>
            <div className="category-grid">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="category-card"
                  data-reveal
                  style={{ transitionDelay: `${100 + i * 45}ms` }}
                >
                  <span className="cat-icon" aria-hidden>{cat.icon ?? "◆"}</span>
                  <span className="cat-name">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured: Best Sellers / New Arrivals / Top Deals */}
        <section className="section" data-reveal>
          <div className="container">
            <div className="section-heading" data-reveal style={{ transitionDelay: "40ms" }}>
              <h2>Featured Products</h2>
              <p>Best sellers, new arrivals, and top deals</p>
            </div>
            <div className="tabs-header" data-reveal style={{ transitionDelay: "90ms" }}>
              <button
                type="button"
                className={`tab-btn ${featuredTab === "bestsellers" ? "active" : ""}`}
                onClick={() => setFeaturedTab("bestsellers")}
              >
                Best Sellers
              </button>
              <button
                type="button"
                className={`tab-btn ${featuredTab === "new" ? "active" : ""}`}
                onClick={() => setFeaturedTab("new")}
              >
                New Arrivals
              </button>
              <button
                type="button"
                className={`tab-btn ${featuredTab === "deals" ? "active" : ""}`}
                onClick={() => setFeaturedTab("deals")}
              >
                Top Deals
              </button>
            </div>
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Custom Build PC */}
        <section className="section" data-reveal>
          <div className="container">
            <div className="custom-build-section">
              <h2 data-reveal style={{ transitionDelay: "30ms" }}>Build Your Custom PC</h2>
              <div className="custom-build-steps">
                <div className="custom-build-step" data-reveal style={{ transitionDelay: "90ms" }}>
                  <div className="step-num">1</div>
                  <p className="step-title">Choose your budget</p>
                </div>
                <div className="custom-build-step" data-reveal style={{ transitionDelay: "130ms" }}>
                  <div className="step-num">2</div>
                  <p className="step-title">Select purpose (Gaming / Office / Editing)</p>
                </div>
                <div className="custom-build-step" data-reveal style={{ transitionDelay: "170ms" }}>
                  <div className="step-num">3</div>
                  <p className="step-title">Pick parts (guided compatibility)</p>
                </div>
                <div className="custom-build-step" data-reveal style={{ transitionDelay: "210ms" }}>
                  <div className="step-num">4</div>
                  <p className="step-title">Get assembled & tested</p>
                </div>
                <div className="custom-build-step" data-reveal style={{ transitionDelay: "250ms" }}>
                  <div className="step-num">5</div>
                  <p className="step-title">Delivered to your doorstep</p>
                </div>
              </div>
              <div className="custom-build-cta" data-reveal style={{ transitionDelay: "300ms" }}>
                <Link to="/custom-build" className="btn">
                  Start Custom Build
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Brands - logos scrolling right to left */}
        <section className="section section-alt" data-reveal>
          <div className="container">
            <div className="section-heading" data-reveal style={{ transitionDelay: "50ms" }}>
              <h2>Popular Brands</h2>
            </div>
            <BrandsMarquee />
          </div>
        </section>

        {/* Why Shivam Computer */}
        <section className="section" data-reveal>
          <div className="container">
            <div className="section-heading" data-reveal style={{ transitionDelay: "40ms" }}>
              <h2>Why Shivam Computer</h2>
              <p>Your trusted partner for PCs and components</p>
            </div>
            <div className="trust-grid">
              {TRUST_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  className="trust-card"
                  data-reveal
                  style={{ transitionDelay: `${80 + i * 35}ms` }}
                >
                  <div className="icon">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className="section section-alt" data-reveal>
          <div className="container">
            <div className="section-heading" data-reveal style={{ transitionDelay: "40ms" }}>
              <h2>Customer Reviews</h2>
              <p>What our customers say</p>
            </div>
            <div className="reviews-grid">
              {REVIEWS.map((review, i) => (
                <div
                  key={i}
                  className="review-card"
                  data-reveal
                  style={{ transitionDelay: `${90 + i * 55}ms` }}
                >
                  <div className="stars">{"★".repeat(review.stars)}</div>
                  {review.verified && <div className="verified">✓ Verified Purchase</div>}
                  <p>{review.text}</p>
                  <div className="author">— {review.author}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

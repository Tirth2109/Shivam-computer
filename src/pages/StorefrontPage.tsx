import { useState } from "react";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import ProductGrid from "../components/ProductGrid";
import StockMeters from "../components/StockMeters";
import Categories from "../components/Categories";
import AutomationHighlights from "../components/AutomationHighlights";
import Testimonials from "../components/Testimonials";
import CtaBanner from "../components/CtaBanner";
import Toast from "../components/Toast";
import { useProducts } from "../context/ProductsContext";
import { useMockAutomation } from "../hooks/useMockAutomation";
import { useHeadlineRotation } from "../hooks/useHeadlineRotation";
import type { Product } from "../types";

export default function StorefrontPage() {
  const { products } = useProducts();
  const { simulateOrder } = useMockAutomation();
  const headline = useHeadlineRotation();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleBuy = (product: Product) => {
    const order = simulateOrder(product);
    setToastMessage(`${order.productName} added to mock orders`);
    setTimeout(() => setToastMessage(null), 2200);
  };

  const scrollToProducts = () => {
    document.getElementById("top-products")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeaderWithDeals />
      <main>
        <section className="hero">
          <div>
            <p className="eyebrow">Built for pros, students, and creators</p>
            <h1>All the computer gear you need under one roof</h1>
            <p className="lead">
              Laptops, keyboards, accessories, and electronics that ship
              instantly with automated restock alerts and friendly support.
            </p>
            <div className="cta-group">
              <button className="btn primary" type="button" onClick={scrollToProducts}>
                Shop laptops
              </button>
              <button className="btn outline" type="button" onClick={scrollToContact}>
                Talk to us
              </button>
            </div>
          </div>
          <div className="hero-panel">
            <p>Automated availability</p>
            <StockMeters products={products} />
          </div>
        </section>

        <ProductGrid products={products} onBuy={handleBuy} />
        <Categories />
        <AutomationHighlights restockMessage={headline} />
        <Testimonials />
        <CtaBanner />
      </main>
      <Footer />
      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
}

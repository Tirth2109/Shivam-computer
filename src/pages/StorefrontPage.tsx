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
    setToastMessage(`${order.items[0]?.productName ?? product.name} added to mock orders`);
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
        <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 px-5 py-10 lg:grid-cols-[1fr_320px]">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#a8b6ca]">Built for pros, students, and creators</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#ecf3ff]">All the computer gear you need under one roof</h1>
            <p className="mt-4 max-w-2xl text-base text-[#a7b0bd]">
              Laptops, keyboards, accessories, and electronics that ship
              instantly with automated restock alerts and friendly support.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                className="inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                type="button"
                onClick={scrollToProducts}
              >
                Shop laptops
              </button>
              <button
                className="inline-flex items-center rounded-full border border-[#2a3f5d] px-5 py-2.5 text-sm font-semibold text-[#ecf3ff] transition hover:border-[#5ec7ff] hover:text-[#5ec7ff]"
                type="button"
                onClick={scrollToContact}
              >
                Talk to us
              </button>
            </div>
          </div>
          <div className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4">
            <p className="text-sm font-semibold text-[#ecf3ff]">Automated availability</p>
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

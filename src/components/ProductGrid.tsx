import type { Product } from "../types";
import ProductCard from "./ProductCard";

type ProductGridProps = {
  products: Product[];
  onBuy: (product: Product) => void;
};

export default function ProductGrid({ products, onBuy }: ProductGridProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10" id="top-products">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-[#ecf3ff]">Featured Computers &amp; Components</h2>
        <p className="mt-1 text-sm text-[#a8b6ca]">Updated automatically whenever new units arrive.</p>
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" aria-live="polite">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onBuyNow={onBuy} />
        ))}
      </div>
    </section>
  );
}

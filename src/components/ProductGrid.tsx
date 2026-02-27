import type { Product } from "../types";

type ProductGridProps = {
  products: Product[];
  onBuy: (product: Product) => void;
};

export default function ProductGrid({ products, onBuy }: ProductGridProps) {
  return (
    <section className="featured" id="top-products">
      <div className="section-heading">
        <h2>Featured Computers &amp; Components</h2>
        <p>Updated automatically whenever new units arrive.</p>
      </div>
      <div className="product-grid" aria-live="polite">
        {products.map((product) => (
          <article className="product-card" key={product.id}>
            <div>
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">${product.price.toLocaleString()}</p>
              <p className="specs">{product.specs.join(" • ")}</p>
            </div>
            <div className="cta-group">
              <button
                className="btn outline"
                onClick={() => onBuy(product)}
                type="button"
              >
                Buy now
              </button>
              <span className={product.stock < 8 ? "low-stock" : ""}>
                {product.stock} in stock
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

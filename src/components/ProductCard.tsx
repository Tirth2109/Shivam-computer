import { Link } from "react-router-dom";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
}

function Stars({ rating = 0 }: { rating?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="product-card-rating">
      <span className="stars">
        {"★".repeat(full)}
        {half ? "½" : ""}
        {"☆".repeat(empty)}
      </span>
      <span> {rating.toFixed(1)}</span>
    </span>
  );
}

export default function ProductCard({ product, onAddToCart, onBuyNow }: ProductCardProps) {
  const discount = product.discountPercent ?? 0;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-image">
        <img src={product.image} alt={product.name} loading="lazy" />
        {discount > 0 && (
          <span className="product-card-badge">{discount}% OFF</span>
        )}
      </Link>
      <div className="product-card-body">
        <h3>
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-category">{product.category}</p>
        {product.rating != null && <Stars rating={product.rating} />}
        <div className="product-card-price">
          <span className="current">₹{product.price.toLocaleString("en-IN")}</span>
          {product.mrp != null && product.mrp > product.price && (
            <>
              <span className="mrp">₹{product.mrp.toLocaleString("en-IN")}</span>
              {discount > 0 && <span className="discount">{discount}% off</span>}
            </>
          )}
        </div>
        <div className="product-card-actions">
          {onAddToCart && (
            <button
              type="button"
              className="btn secondary btn-sm"
              onClick={() => onAddToCart(product)}
            >
              Add to Cart
            </button>
          )}
          {onBuyNow && (
            <button
              type="button"
              className="btn primary btn-sm"
              onClick={() => onBuyNow(product)}
            >
              Buy Now
            </button>
          )}
          {!onAddToCart && !onBuyNow && (
            <>
              <Link to={`/product/${product.id}`} className="btn primary btn-sm">
                Buy Now
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

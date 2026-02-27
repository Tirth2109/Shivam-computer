import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";

const AUTO_ADVANCE_SEC = 5;

export default function DealsStrip() {
  const [index, setIndex] = useState(0);
  const { latestLaptopAndHeadphoneDeals: deals } = useProducts();

  useEffect(() => {
    if (deals.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % deals.length);
    }, AUTO_ADVANCE_SEC * 1000);
    return () => clearInterval(id);
  }, [deals.length]);

  if (deals.length === 0) return null;

  const deal = deals[index];

  return (
    <div className="deals-slideshow-wrap">
      <Link
        to={`/product/${deal.id}`}
        className="deals-slide"
        aria-label={`Deal: ${deal.name}`}
      >
        <div className="deals-slide-bg" />
        <div className="deals-slide-content">
          <div className="deals-slide-image">
            <img src={deal.image} alt={deal.name} />
            {deal.discountPercent != null && deal.discountPercent > 0 && (
              <span className="deals-slide-badge">{deal.discountPercent}% OFF</span>
            )}
          </div>
          <div className="deals-slide-body">
            <span className="deals-slide-category">{deal.category}</span>
            <h2 className="deals-slide-name">{deal.name}</h2>
            <div className="deals-slide-price">
              <span className="current">₹{deal.price.toLocaleString("en-IN")}</span>
              {deal.mrp != null && deal.mrp > deal.price && (
                <span className="mrp">₹{deal.mrp.toLocaleString("en-IN")}</span>
              )}
            </div>
            <span className="deals-slide-cta">Shop Now →</span>
          </div>
        </div>
      </Link>
      {deals.length > 1 && (
        <div className="deals-slideshow-dots">
          {deals.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`deals-dot ${i === index ? "active" : ""}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIndex(i);
              }}
              aria-label={`Go to deal ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

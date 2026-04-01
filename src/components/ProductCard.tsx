import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../types";
import { useWishlist } from "../context/WishlistContext";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onBuyNow?: (product: Product) => void;
  badgeLabel?: string;
  showActions?: boolean;
  showRating?: boolean;
}

function Stars({ rating = 0 }: { rating?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return (
    <span className="mb-2 flex items-center gap-1 text-xs text-[#a8b6ca]">
      <span className="text-[#fbbf24]">
        {"★".repeat(full)}
        {half ? "½" : ""}
        {"☆".repeat(empty)}
      </span>
      <span> {rating.toFixed(1)}</span>
    </span>
  );
}

const CARD_THEMES = [
  "from-[#0d1b34] via-[#142745] to-[#1a3257]",
  "from-[#0e1830] via-[#1b2240] to-[#25335b]",
  "from-[#14213a] via-[#1e2c49] to-[#243b66]",
  "from-[#101f3d] via-[#1a2b4c] to-[#2b3f69]",
];

function getThemeFromId(id: string) {
  const sum = [...id].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return CARD_THEMES[sum % CARD_THEMES.length];
}

export default function ProductCard({
  product,
  onAddToCart,
  onBuyNow,
  badgeLabel,
  showActions = true,
  showRating = true,
}: ProductCardProps) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const discount = product.discountPercent ?? 0;
  const hasDiscount = discount > 0 && product.mrp != null && product.mrp > product.price;
  const theme = getThemeFromId(product.id);
  const wished = isInWishlist(product.id);
  const [isAdded, setIsAdded] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current != null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const triggerAddToCart = () => {
    if (!onAddToCart) return;
    onAddToCart(product);
    setIsAdded(true);
    if (resetTimerRef.current != null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setIsAdded(false);
    }, 420);
  };

  return (
    <article className={`group relative overflow-hidden rounded-2xl border border-[#2a3f5d] bg-gradient-to-b ${theme} p-4 shadow-[0_10px_28px_rgba(0,0,0,0.35)] transition hover:-translate-y-1 hover:border-[#5ec7ff66] hover:shadow-[0_14px_36px_rgba(0,0,0,0.45)]`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(94,199,255,0.18),transparent_45%)]" />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex w-max rounded-full border border-[#5ec7ff59] bg-[#5ec7ff1f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#b8e6ff]">
            {badgeLabel ?? (discount > 0 ? "Top Deal" : "Featured")}
          </span>
          <button
            type="button"
            className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-sm transition ${
              wished
                ? "border-[#5ec7ff] bg-[#81d7ff] text-[#050812]"
                : "border-[#5ec7ff] bg-[#5ec7ff] text-[#050812] hover:bg-[#81d7ff]"
            }`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label={wished ? "Remove from favourites" : "Add to favourites"}
            title={wished ? "Remove from favourites" : "Add to favourites"}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill={wished ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.08em] text-[#d5deec]">
          {product.brand ?? product.category}
        </p>
        <h3 className="mt-1 min-h-[3rem] overflow-hidden text-base font-bold leading-tight text-[#ecf3ff]">
          <Link to={`/product/${product.id}`} className="transition hover:text-[#81d7ff]">
            {product.name}
          </Link>
        </h3>
        <Link
          to={`/product/${product.id}`}
          className="mt-3 block rounded-xl border border-white/10 bg-black/15 p-3 backdrop-blur-sm"
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-32 w-full object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)] transition duration-500 group-hover:scale-105"
          />
        </Link>
        {showRating && product.rating != null && (
          <div className="mt-2">
            <Stars rating={product.rating} />
          </div>
        )}
        <div className="mt-2 border-t border-white/15 pt-3">
          <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
            {hasDiscount && product.mrp != null && (
              <span className="text-sm text-[#a8b6ca] line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-2xl font-extrabold text-[#ecf3ff]">₹{product.price.toLocaleString("en-IN")}</span>
            {hasDiscount && <span className="text-sm font-semibold text-[#45d39c]">{discount}% off</span>}
          </div>
          <p className="mt-1 text-xs text-[#d5deec]">*Inclusive of bank offers</p>
        </div>

        {showActions && (
          <div className="mt-3 flex flex-wrap gap-2">
            {onAddToCart && (
              <button
                type="button"
                className={`inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-3 py-2 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff] ${isAdded ? "motion-safe:animate-[cartButtonPop_0.4s_cubic-bezier(0.22,1,0.36,1)]" : ""}`}
                onClick={triggerAddToCart}
              >
                {isAdded ? "Added!" : "Add to Cart"}
              </button>
            )}
            {onBuyNow && (
              <button
                type="button"
                className="inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-3 py-2 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                onClick={() => onBuyNow(product)}
              >
                Buy Now
              </button>
            )}
            {!onAddToCart && !onBuyNow && (
              <Link
                to={`/product/${product.id}`}
                className="inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-3 py-2 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
              >
                Buy Now
              </Link>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

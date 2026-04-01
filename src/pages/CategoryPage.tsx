import { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/categories";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductsContext";
import type { Product } from "../types";
import type { SortOption } from "../types";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "newest", label: "Newest" },
  { value: "rating", label: "Rating" },
];

function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

const COMPONENT_SLUGS = ["processors", "graphics-cards", "motherboards", "ram", "ssd-hdd", "power-supply", "cabinets", "cooling"];

export default function CategoryPage() {
  const { slug: routeSlug } = useParams<{ slug?: string }>();
  const [searchParams] = useSearchParams();
  const { products } = useProducts();
  const slug = routeSlug || searchParams.get("slug") || "all";
  const q = searchParams.get("q") || "";
  const [sort, setSort] = useState<SortOption>("relevance");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const category = slug !== "all" ? getCategoryBySlug(slug) : null;

  const filteredAndSorted = useMemo(() => {
    let list: Product[] = [...products];

    if (slug !== "all") {
      if (slug === "components") {
        list = list.filter((p) => COMPONENT_SLUGS.includes(p.categorySlug));
      } else if (category) {
        list = list.filter((p) => p.categorySlug === category.slug);
      }
    }

    if (q.trim()) {
      const lower = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower) ||
          (p.brand && p.brand.toLowerCase().includes(lower)) ||
          p.specs.some((s) => s.toLowerCase().includes(lower))
      );
    }

    if (brandFilter) {
      list = list.filter((p) => p.brand === brandFilter);
    }
    if (priceMin) {
      const min = Number(priceMin);
      if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
    }
    if (priceMax) {
      const max = Number(priceMax);
      if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
    }
    if (inStockOnly) {
      list = list.filter((p) => p.inStock && p.stock > 0);
    }

    switch (sort) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      case "newest":
        list.reverse();
        break;
      default:
        break;
    }

    return list;
  }, [slug, category, q, sort, brandFilter, priceMin, priceMax, inStockOnly]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return Array.from(set).sort();
  }, []);

  useEffect(() => {
    const title = slug === "components" ? "Computer Components" : category?.name ?? (q ? `Search: ${q}` : "All Products");
    document.title = `${title} | Shivam Computer`;
    return () => { document.title = "Buy Brand New Computers in India | Shivam Computer"; };
  }, [slug, category, q]);

  const handleBuyNow = (product: Product) => {
    addToCart(product, 1);
    navigate("/cart");
  };

  const panelClass = "rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-4";
  const fieldClass =
    "mt-1 w-full rounded-lg border border-[#2a3f5d] bg-transparent px-3 py-2 text-sm text-[#ecf3ff] outline-none transition focus:border-[#5ec7ff]";

  return (
    <>
      <HeaderWithDeals />
      <main>
        <div className="py-10" data-reveal>
          <div className="mx-auto w-full max-w-6xl px-5">
            <div className="mb-6" data-reveal style={{ transitionDelay: "50ms" }}>
              <h2 className="text-2xl font-semibold text-[#ecf3ff]">
                {slug === "components"
                  ? "Computer Components"
                  : category
                    ? category.name
                    : q
                      ? `Search: "${q}"`
                      : "All Products"}
              </h2>
              <p className="mt-1 text-sm text-[#a8b6ca]">{filteredAndSorted.length} products</p>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[260px_1fr]">
              <aside className={panelClass}>
                <h3 className="mb-3 text-lg font-semibold text-[#ecf3ff]">Filters</h3>
                <div className="mb-3">
                  <label className="text-sm font-medium text-[#d5deec]">Brand</label>
                  <select
                    className={fieldClass}
                    value={brandFilter}
                    onChange={(e) => setBrandFilter(e.target.value)}
                  >
                    <option value="">All brands</option>
                    {brands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="text-sm font-medium text-[#d5deec]">Min price (₹)</label>
                  <input
                    className={fieldClass}
                    type="number"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="text-sm font-medium text-[#d5deec]">Max price (₹)</label>
                  <input
                    className={fieldClass}
                    type="number"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                  />
                </div>
                <div>
                  <label className="inline-flex items-center gap-2 text-sm text-[#d5deec]">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setInStockOnly(e.target.checked)}
                      className="h-4 w-4 rounded border-[#2a3f5d] bg-transparent"
                    />
                    In stock only
                  </label>
                </div>
              </aside>

              <div>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    className="hidden rounded-full border border-[#2a3f5d] px-3 py-1.5 text-xs font-semibold text-[#ecf3ff]"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? "Hide" : "Filter"}
                  </button>
                  <select
                    className="ml-auto rounded-lg border border-[#2a3f5d] bg-[#111b2c] px-3 py-2 text-sm text-[#ecf3ff] outline-none focus:border-[#5ec7ff]"
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortOption)}
                    aria-label="Sort by"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                  {filteredAndSorted.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={addToCart}
                      onBuyNow={handleBuyNow}
                    />
                  ))}
                </div>
                {filteredAndSorted.length === 0 && (
                  <p className="mt-4 text-sm text-[#a8b6ca]">No products match your filters.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

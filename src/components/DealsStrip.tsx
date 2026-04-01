import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductsContext";
import type { Product } from "../types";

const AUTO_ADVANCE_SEC = 5;
const HERO_SLIDE_COUNT = 5;

const HERO_THEMES = [
  {
    shell: "from-[#050913] via-[#0a1226] to-[#111a36]",
    glowA: "bg-[radial-gradient(circle_at_14%_20%,rgba(56,189,248,0.35),transparent_44%)]",
    glowB: "bg-[radial-gradient(circle_at_86%_75%,rgba(168,85,247,0.28),transparent_46%)]",
    badge: "bg-[#22d3ee] text-[#032731]",
    accent: "from-[#67e8f9] via-[#60a5fa] to-[#c084fc]",
    chip: "border-[#22d3ee66] text-[#67e8f9]",
  },
  {
    shell: "from-[#09060f] via-[#161022] to-[#201730]",
    glowA: "bg-[radial-gradient(circle_at_20%_26%,rgba(244,63,94,0.28),transparent_44%)]",
    glowB: "bg-[radial-gradient(circle_at_84%_72%,rgba(234,179,8,0.25),transparent_48%)]",
    badge: "bg-[#fb7185] text-[#2d0915]",
    accent: "from-[#fda4af] via-[#f472b6] to-[#facc15]",
    chip: "border-[#fb718566] text-[#fda4af]",
  },
  {
    shell: "from-[#04120d] via-[#0a2218] to-[#12352a]",
    glowA: "bg-[radial-gradient(circle_at_16%_22%,rgba(16,185,129,0.30),transparent_45%)]",
    glowB: "bg-[radial-gradient(circle_at_84%_72%,rgba(59,130,246,0.26),transparent_48%)]",
    badge: "bg-[#34d399] text-[#052e2b]",
    accent: "from-[#6ee7b7] via-[#22d3ee] to-[#93c5fd]",
    chip: "border-[#34d39966] text-[#6ee7b7]",
  },
];

export default function DealsStrip() {
  const [index, setIndex] = useState(0);
  const {
    products,
    latestLaptopAndHeadphoneDeals,
    carouselProductIds,
  } = useProducts();

  const productById = new Map(products.map((product) => [product.id, product]));
  const prioritizedDeals = carouselProductIds
    .map((id) => productById.get(id))
    .filter(Boolean)
    .slice(0, HERO_SLIDE_COUNT) as Product[];

  const deals: Product[] = [];
  const seen = new Set<string>();
  const appendUnique = (list: Product[]) => {
    for (const item of list) {
      if (deals.length >= HERO_SLIDE_COUNT) break;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      deals.push(item);
    }
  };

  appendUnique(prioritizedDeals);
  appendUnique(latestLaptopAndHeadphoneDeals);
  appendUnique(products);

  useEffect(() => {
    if (deals.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % deals.length);
    }, AUTO_ADVANCE_SEC * 1000);
    return () => clearInterval(id);
  }, [deals.length]);

  useEffect(() => {
    if (deals.length === 0) return;
    setIndex((curr) => (curr >= deals.length ? 0 : curr));
  }, [deals.length]);

  if (deals.length === 0) return null;

  const deal = deals[index];
  const theme = HERO_THEMES[index % HERO_THEMES.length];
  const discount = deal.discountPercent ?? 0;

  const prevSlide = () => {
    setIndex((curr) => (curr === 0 ? deals.length - 1 : curr - 1));
  };

  const nextSlide = () => {
    setIndex((curr) => (curr + 1) % deals.length);
  };

  return (
    <section className="min-h-[calc(100dvh-var(--site-header-height,120px))] border-b border-[#2a3f5d] bg-[#050812]">
      <div className="mx-auto flex min-h-[calc(100dvh-var(--site-header-height,120px))] w-full max-w-[1500px] flex-col px-0 py-0 sm:px-4 sm:py-4">
        <div
          key={deal.id}
          className={`relative flex-1 overflow-hidden border border-[#2a3f5d66] sm:rounded-2xl bg-gradient-to-br ${theme.shell}`}
          aria-label={`Deal: ${deal.name}`}
        >
          <div className={`pointer-events-none absolute inset-0 ${theme.glowA}`} />
          <div className={`pointer-events-none absolute inset-0 ${theme.glowB}`} />
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
            }}
          />

          {deals.length > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-2xl font-light text-white backdrop-blur transition hover:border-white/30 hover:bg-black/50"
                aria-label="Previous deal"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-lg border border-white/15 bg-black/35 px-3 py-2 text-2xl font-light text-white backdrop-blur transition hover:border-white/30 hover:bg-black/50"
                aria-label="Next deal"
              >
                ›
              </button>
            </>
          )}

          <div className="grid h-full items-center gap-6 px-5 py-8 md:grid-cols-[1.05fr_1fr] md:px-12 md:py-12">
            <div className="relative z-10">
              <p className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${theme.chip}`}>
                {deal.category}
              </p>
              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight text-[#f8fafc] md:text-5xl">
                {deal.name}
              </h2>
              <div className="mt-3 flex items-end gap-3">
                <span className="bg-gradient-to-r from-white via-[#e2e8f0] to-[#a5b4fc] bg-clip-text text-4xl font-black text-transparent md:text-5xl">
                  ₹{deal.price.toLocaleString("en-IN")}
                </span>
                {deal.mrp != null && deal.mrp > deal.price && (
                  <span className="pb-1 text-xl font-semibold text-[#94a3b8] line-through">
                    ₹{deal.mrp.toLocaleString("en-IN")}
                  </span>
                )}
                {discount > 0 && (
                  <span className="pb-1 text-xl font-bold text-[#f43f5e]">
                    {discount}% off
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm font-medium text-[#cbd5e1]">
                Exclusive launch offer. Limited stock available.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to={`/product/${deal.id}`}
                  className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-bold transition hover:brightness-110 ${theme.badge}`}
                >
                  Shop now
                </Link>
                <Link
                  to={`/product/${deal.id}`}
                  className="inline-flex items-center rounded-lg border border-[#475569] bg-black/20 px-5 py-2.5 text-sm font-semibold text-[#e2e8f0] transition hover:border-[#93c5fd] hover:text-white"
                >
                  View details
                </Link>
              </div>
            </div>

            <div className="relative z-10">
              <Link
                to={`/product/${deal.id}`}
                className="group relative flex h-[300px] items-center justify-center rounded-2xl border border-white/15 bg-black/30 p-2 backdrop-blur-sm transition hover:border-white/30 md:h-[min(70vh,40rem)] md:p-3"
              >
                <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.08),transparent_42%)]" />
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="relative z-10 h-full w-full object-contain drop-shadow-[0_16px_30px_rgba(0,0,0,0.55)] transition duration-500 group-hover:scale-[1.04]"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import BrandsMarquee from "../components/BrandsMarquee";
import WhatsAppFloat from "../components/WhatsAppFloat";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/categories";
import { useProducts } from "../context/ProductsContext";
import type { Product } from "../types";

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

function pickUniqueProducts(list: Product[], count: number) {
  const seen = new Set<string>();
  const result: Product[] = [];

  for (const product of list) {
    if (seen.has(product.id)) continue;
    seen.add(product.id);
    result.push(product);
    if (result.length >= count) break;
  }

  return result;
}

export default function HomePage() {
  const { bestSellers, newArrivals, topDeals } = useProducts();

  const featuredPool = [...topDeals, ...bestSellers, ...newArrivals];
  const whatsHot = pickUniqueProducts(featuredPool, 4);
  const dealsOfDay = pickUniqueProducts([...newArrivals, ...topDeals, ...bestSellers], 4);

  const sectionClass = "py-10";
  const sectionAltClass = "bg-[#0f1726]/50 py-10";
  const containerClass = "mx-auto w-full max-w-6xl px-5";
  const headingTitleClass = "text-2xl font-semibold text-[#ecf3ff]";
  const headingTextClass = "mt-1 text-sm text-[#a8b6ca]";

  return (
    <>
      <HeaderWithDeals />
      <main>
        {/* Shop by Category */}
        <section className={sectionAltClass} data-reveal>
          <div className={containerClass}>
            <div className="mb-6" data-reveal style={{ transitionDelay: "60ms" }}>
              <h2 className={headingTitleClass}>Shop by Category</h2>
              <p className={headingTextClass}>Find desktops, components, laptops, and more</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/category/${cat.slug}`}
                  className="group flex flex-col items-center rounded-xl border border-[#2a3f5d] bg-[#111b2c] px-3 py-5 text-center transition hover:-translate-y-1 hover:border-[#5ec7ff66]"
                  data-reveal
                  style={{ transitionDelay: `${100 + i * 45}ms` }}
                >
                  <span
                    className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#5ec7ff40] bg-[#5ec7ff1f] text-2xl transition group-hover:scale-110"
                    aria-hidden
                  >
                    {cat.icon ?? "◆"}
                  </span>
                  <span className="text-xs font-semibold text-[#ecf3ff]">{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured product blocks (screenshot style) */}
        <section className={sectionClass} data-reveal>
          <div className={containerClass}>
            <div data-reveal style={{ transitionDelay: "40ms" }}>
              <h2 className={headingTitleClass}>What&apos;s Hot</h2>
              <p className={headingTextClass}>Trending picks with best running offers</p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {whatsHot.map((product) => (
                <ProductCard
                  key={`hot-${product.id}`}
                  product={product}
                  badgeLabel="What's Hot"
                  showActions={false}
                  showRating={false}
                />
              ))}
            </div>

            <div className="mt-10" data-reveal style={{ transitionDelay: "70ms" }}>
              <h2 className={headingTitleClass}>Deals Of The Day</h2>
              <p className={headingTextClass}>Best prices right now across top categories</p>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {dealsOfDay.map((product) => (
                <ProductCard
                  key={`deal-${product.id}`}
                  product={product}
                  badgeLabel="Deal Of Day"
                  showActions={false}
                  showRating={false}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Custom Build PC */}
        <section className={sectionClass} data-reveal>
          <div className={containerClass}>
            <div className="rounded-2xl border border-[#2a3f5d] bg-[#111b2c] px-5 py-7">
              <h2 className={headingTitleClass} data-reveal style={{ transitionDelay: "30ms" }}>Build Your Custom PC</h2>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
                <div className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-3 text-center" data-reveal style={{ transitionDelay: "90ms" }}>
                  <div className="mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">1</div>
                  <p className="text-xs text-[#d5deec]">Choose your budget</p>
                </div>
                <div className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-3 text-center" data-reveal style={{ transitionDelay: "130ms" }}>
                  <div className="mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">2</div>
                  <p className="text-xs text-[#d5deec]">Select purpose (Gaming / Office / Editing)</p>
                </div>
                <div className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-3 text-center" data-reveal style={{ transitionDelay: "170ms" }}>
                  <div className="mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">3</div>
                  <p className="text-xs text-[#d5deec]">Pick parts (guided compatibility)</p>
                </div>
                <div className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-3 text-center" data-reveal style={{ transitionDelay: "210ms" }}>
                  <div className="mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">4</div>
                  <p className="text-xs text-[#d5deec]">Get assembled & tested</p>
                </div>
                <div className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-3 text-center" data-reveal style={{ transitionDelay: "250ms" }}>
                  <div className="mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">5</div>
                  <p className="text-xs text-[#d5deec]">Delivered to your doorstep</p>
                </div>
              </div>
              <div className="mt-5" data-reveal style={{ transitionDelay: "300ms" }}>
                <Link
                  to="/custom-build"
                  className="inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                >
                  Start Custom Build
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Brands - logos scrolling right to left */}
        <section className={sectionAltClass} data-reveal>
          <div className={containerClass}>
            <div className="mb-6" data-reveal style={{ transitionDelay: "50ms" }}>
              <h2 className={headingTitleClass}>Popular Brands</h2>
            </div>
            <BrandsMarquee />
          </div>
        </section>

        {/* Why Shivam Computer */}
        <section className={sectionClass} data-reveal>
          <div className={containerClass}>
            <div className="mb-6" data-reveal style={{ transitionDelay: "40ms" }}>
              <h2 className={headingTitleClass}>Why Shivam Computer</h2>
              <p className={headingTextClass}>Your trusted partner for PCs and components</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TRUST_ITEMS.map((item, i) => (
                <div
                  key={item.title}
                  className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5"
                  data-reveal
                  style={{ transitionDelay: `${80 + i * 35}ms` }}
                >
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <h4 className="text-base font-semibold text-[#ecf3ff]">{item.title}</h4>
                  <p className="mt-2 text-sm text-[#a8b6ca]">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className={sectionAltClass} data-reveal>
          <div className={containerClass}>
            <div className="mb-6" data-reveal style={{ transitionDelay: "40ms" }}>
              <h2 className={headingTitleClass}>Customer Reviews</h2>
              <p className={headingTextClass}>What our customers say</p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {REVIEWS.map((review, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5"
                  data-reveal
                  style={{ transitionDelay: `${90 + i * 55}ms` }}
                >
                  <div className="text-sm text-[#fbbf24]">{"★".repeat(review.stars)}</div>
                  {review.verified && <div className="mt-1 text-xs font-semibold text-[#3fb950]">✓ Verified Purchase</div>}
                  <p className="mt-3 text-sm text-[#d5deec]">{review.text}</p>
                  <div className="mt-3 text-sm text-[#a8b6ca]">— {review.author}</div>
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

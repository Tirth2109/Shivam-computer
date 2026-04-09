import { useState } from "react";
import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";
import BrandsMarquee from "../components/BrandsMarquee";
import WhatsAppFloat from "../components/WhatsAppFloat";
import ProductCard from "../components/ProductCard";
import { categories } from "../data/categories";
import { useProducts } from "../context/ProductsContext";
import { useBuilder } from "../context/BuilderContext";
import type { Product } from "../types";

const TRUST_ITEMS = [
  { icon: "✅", title: "Genuine & Sealed Products", text: "100% authentic with manufacturer warranty" },
  { icon: "💰", title: "Best Price Guarantee", text: "Competitive prices across India" },
  { icon: "📄", title: "GST Invoice Available", text: "Proper billing for business & personal" },
  { icon: "🚚", title: "Fast Shipping & Safe Packaging", text: "Delivery across India, secure packaging" },
  { icon: "🔄", title: "Easy Replacement Policy", text: "Hassle-free returns within policy" },
  { icon: "🛠️", title: "Expert Technical Support", text: "WhatsApp & call support for builds" },
];

const TRUST_HEX_POSITIONS = [
  "lg:col-start-1",
  "lg:col-start-3",
  "lg:col-start-5",
  "lg:col-start-2",
  "lg:col-start-4",
  "lg:col-start-6",
];

const REVIEW_SHOWCASE = [
  {
    author: "Rahul M.",
    initials: "RM",
    text: "The custom gaming PC arrived in five days. Cable management was clean, performance was excellent, and delivery updates were on time.",
    rating: "4.9/5",
  },
  {
    author: "Priya S.",
    initials: "PS",
    text: "I ordered RAM and SSD together and both were genuine, well packed, and priced better than nearby stores.",
    rating: "4.9/5",
  },
  {
    author: "Vikram K.",
    initials: "VK",
    text: "The team suggested the right parts for my budget and avoided compatibility issues from day one.",
    rating: "4.9/5",
  },
];

const REVIEW_AVATAR_BACKGROUNDS = [
  "bg-[linear-gradient(135deg,#2c6682,#4b9db2)]",
  "bg-[linear-gradient(135deg,#7446a8,#9e63cb)]",
  "bg-[linear-gradient(135deg,#8c4a47,#c06e62)]",
];

const FAQ_ITEMS = [
  {
    icon: "🚚",
    question: "Do you ship across India?",
    answer: "Yes. In-stock parts ship pan-India with insured, foam-in-box packing. Dispatch usually happens within 24-48 hours.",
  },
  {
    icon: "🧰",
    question: "How do I order a custom PC online?",
    answer: "Use the Custom Build page, pick budget and purpose, and our team finalizes a compatible list before assembling and shipping.",
  },
  {
    icon: "🔒",
    question: "Are the products genuine with warranty?",
    answer: "All parts are sealed, billed with a GST invoice, and covered by the respective brand warranty across India.",
  },
  {
    icon: "🧪",
    question: "Do you test PCs before delivery?",
    answer: "Every build is cable-managed, stress-tested, and then packed with cushioning so it's ready to plug and play.",
  },
  {
    icon: "🎯",
    question: "Can you help me choose the right parts?",
    answer: "Yes. Tell us your game/workload and budget on WhatsApp or call; we'll share a balanced shortlist that avoids bottlenecks.",
  },
  {
    icon: "♻️",
    question: "What if I need a replacement?",
    answer: "If something arrives damaged or defective, contact support immediately. We assist with quick replacements within policy and warranty.",
  },
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
  const { config: builderConfig, activeSteps: builderSteps } = useBuilder();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
              <h2 className={headingTitleClass} data-reveal style={{ transitionDelay: "30ms" }}>
                {builderConfig.settings.heroHeading}
              </h2>
              <p className={headingTextClass} data-reveal style={{ transitionDelay: "60ms" }}>
                {builderConfig.settings.heroSubheading}
              </p>
              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {builderSteps.map((step, i) => (
                  <div
                    key={step.id}
                    className="rounded-xl border border-[#2a3f5d] bg-[#0f1625] p-3 text-center"
                    data-reveal
                    style={{ transitionDelay: `${90 + i * 40}ms` }}
                  >
                    <div className="mx-auto mb-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-sm font-semibold text-white">
                      {i + 1}
                    </div>
                    <p className="text-xs text-[#d5deec]">{step.title}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5" data-reveal style={{ transitionDelay: "300ms" }}>
                <Link
                  to="/custom-build"
                  className="inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                >
                  {builderConfig.settings.ctaLabel}
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
        <section className={`${sectionClass} relative overflow-hidden`} data-reveal>
          <div
            className="pointer-events-none absolute left-1/2 top-8 h-56 w-56 -translate-x-1/2 rounded-full bg-[#5ec7ff1a] blur-3xl"
            aria-hidden
          />
          <div className={containerClass}>
            <div className="mb-6 text-center" data-reveal style={{ transitionDelay: "40ms" }}>
              <h2 className={headingTitleClass}>Why Shivam Computer</h2>
              <p className={headingTextClass}>Your trusted partner for PCs and components</p>
            </div>
            <div className="why-hex-network relative mx-auto max-w-[1100px]">
              <div
                className="pointer-events-none absolute inset-x-8 top-[38%] hidden h-px bg-gradient-to-r from-transparent via-[#2a3f5d] to-transparent lg:block"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute inset-x-16 top-[67%] hidden h-px bg-gradient-to-r from-transparent via-[#2a3f5d]/80 to-transparent lg:block"
                aria-hidden
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7 lg:gap-x-0 lg:gap-y-2">
                {TRUST_ITEMS.map((item, i) => (
                  <article
                    key={item.title}
                    className={`mx-auto w-full max-w-[320px] lg:col-span-2 ${TRUST_HEX_POSITIONS[i] ?? "lg:col-start-1"} ${
                      i >= Math.ceil(TRUST_ITEMS.length / 2) ? "lg:-mt-16" : ""
                    }`}
                    data-reveal
                    style={{ transitionDelay: `${80 + i * 35}ms` }}
                  >
                    <div
                      className="why-hex-card group h-[220px] sm:h-[230px] lg:h-[240px]"
                      style={{ animationDelay: `${i * 0.35}s` }}
                    >
                      <div className="why-hex-shell" />
                      <div className="why-hex-core" />
                      <div className="relative z-10 flex h-full flex-col items-center justify-center px-10 text-center">
                        <span className="why-hex-icon mb-3 inline-flex h-11 w-11 items-center justify-center rounded-full text-xl text-[#5ec7ff]">
                          {item.icon}
                        </span>
                        <h4 className="text-base font-semibold leading-tight text-[#ecf3ff]">{item.title}</h4>
                        <p className="mt-2 text-sm leading-relaxed text-[#a8b6ca]">{item.text}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={`${sectionAltClass} relative overflow-hidden`} data-reveal>
          <div className="pointer-events-none absolute -left-20 top-[-140px] h-60 w-60 rounded-full bg-[#5ec7ff1f] blur-3xl" aria-hidden />
          <div className="pointer-events-none absolute -right-24 bottom-[-120px] h-64 w-64 rounded-full bg-[#81d7ff1a] blur-3xl" aria-hidden />
          <div className={containerClass}>
            <div className="mb-8 flex flex-col gap-2" data-reveal style={{ transitionDelay: "40ms" }}>
              <p className="inline-flex w-fit items-center gap-2 rounded-full border border-[#2a3f5d] bg-[#111b2c] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#5ec7ff]">
                FAQs
                <span className="h-1 w-1 rounded-full bg-[#5ec7ff]" />
                Quick Help
              </p>
              <h2 className="text-3xl font-semibold text-[#ecf3ff]">Frequently asked questions</h2>
              <p className={headingTextClass}>Answers tailored for Shivam Computer customers.</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="space-y-3">
                {FAQ_ITEMS.map((item, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <button
                      key={item.question}
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group w-full overflow-hidden rounded-2xl border border-[#2a3f5d] bg-[#111b2c] p-4 text-left transition hover:-translate-y-1 hover:border-[#5ec7ff66] hover:shadow-[0_18px_40px_rgba(5,8,18,0.35)]"
                      data-reveal
                      style={{ transitionDelay: `${80 + i * 35}ms` }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#5ec7ff1f] text-lg">
                          {item.icon}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h4 className="text-base font-semibold text-[#ecf3ff]">{item.question}</h4>
                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#2a3f5d] text-lg font-semibold text-[#ecf3ff] transition ${
                                isOpen ? "bg-[#5ec7ff1f] text-[#5ec7ff]" : "bg-[#0f1625]"
                              }`}
                              aria-hidden
                            >
                              {isOpen ? "-" : "+"}
                            </span>
                          </div>
                          <div
                            className={`mt-2 overflow-hidden text-sm text-[#a8b6ca] transition-all duration-300 ${
                              isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                            }`}
                          >
                            {item.answer}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                className="relative overflow-hidden rounded-2xl border border-[#2a3f5d] bg-[#0f1625] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                data-reveal
                style={{ transitionDelay: "120ms" }}
              >
                <div className="pointer-events-none absolute -right-10 -top-12 h-32 w-32 rounded-full bg-[#5ec7ff26] blur-3xl" aria-hidden />
                <div className="pointer-events-none absolute -left-14 bottom-0 h-28 w-28 rounded-full bg-[#81d7ff1a] blur-2xl" aria-hidden />
                <div className="relative flex flex-col gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#5ec7ff1f] text-[#5ec7ff]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                      <path d="M9 18h6" />
                      <path d="M10 14a4 4 0 1 1 4 0v2h-4v-2z" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-[#ecf3ff]">Need personal guidance?</h3>
                  <p className="text-sm text-[#a8b6ca]">
                    Talk to our build experts for compatibility checks, upgrade advice, and delivery timelines.
                  </p>
                  <div className="rounded-xl border border-dashed border-[#2a3f5d] bg-[#111b2c] px-4 py-3 text-sm text-[#d5deec]">
                    <div className="font-semibold text-[#5ec7ff]">Direct support</div>
                    <div>WhatsApp: +91 99746 55284</div>
                    <div>Call: +91 99786 80246 / 99253 80246</div>
                    <div>Email: shivam.computer66@gmail.com</div>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-1">
                    <a
                      href="https://wa.me/919974655284?text=Hi%2C%20I%20need%20help%20choosing%20a%20PC%20or%20component."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                    >
                      Chat on WhatsApp
                    </a>
                    <Link
                      to="/support"
                      className="inline-flex items-center justify-center rounded-full border border-[#2a3f5d] bg-[#0f1625] px-4 py-2 text-sm font-semibold text-[#ecf3ff] transition hover:border-[#5ec7ff66]"
                    >
                      Request a callback
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Reviews */}
        <section className={`${sectionAltClass} relative overflow-hidden`} data-reveal>
          <div className={containerClass}>
            <div
              className="relative overflow-hidden rounded-[30px] border border-[#2a3f5d] bg-[linear-gradient(130deg,#0f4a52_0%,#0c3f47_38%,#0f2338_100%)] p-5 shadow-[0_28px_64px_rgba(2,10,20,0.45)] sm:p-7 lg:p-8"
              data-reveal
              style={{ transitionDelay: "40ms" }}
            >
              <div className="pointer-events-none absolute -left-24 top-[-120px] h-64 w-64 rounded-full bg-[#6bf2df26] blur-3xl" aria-hidden />
              <div className="pointer-events-none absolute -right-20 bottom-[-120px] h-64 w-64 rounded-full bg-[#81d7ff1f] blur-3xl" aria-hidden />

              <div className="grid items-stretch gap-4 xl:grid-cols-[0.9fr_1.3fr]">
                <aside
                  className="flex flex-col justify-between rounded-2xl border border-[#95d7cc30] bg-[#04222ba8] p-6"
                  data-reveal
                  style={{ transitionDelay: "80ms" }}
                >
                  <div>
                    <p className="inline-flex items-center gap-2 rounded-full border border-[#95d7cc4a] bg-[#0f4b4f66] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d7f5ed]">
                      Customer Trust
                      <span className="h-1 w-1 rounded-full bg-[#d7f5ed]" />
                      Real Feedback
                    </p>
                    <h2 className="mt-4 max-w-sm text-4xl leading-tight text-[#f2fffb] sm:text-5xl">
                      What Our Happy Clients Say
                    </h2>
                    <p className="mt-4 max-w-sm text-sm leading-7 text-[#c7e4de]">
                      Hear genuine feedback from customers who trust us for reliable builds, fast support, and dependable service.
                    </p>
                  </div>

                  <div className="mt-8">
                    <div className="flex items-center gap-3">
                      <div className="flex -space-x-2">
                        {REVIEW_SHOWCASE.map((review, i) => (
                          <span
                            key={review.author}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/25 text-xs font-bold text-white ${REVIEW_AVATAR_BACKGROUNDS[i % REVIEW_AVATAR_BACKGROUNDS.length]}`}
                          >
                            {review.initials}
                          </span>
                        ))}
                      </div>
                      <span className="inline-flex h-10 items-center rounded-full border border-[#ffb06e66] bg-[#ff7a1a] px-3 text-sm font-bold text-white">
                        18+
                      </span>
                    </div>
                    <p className="mt-3 text-xs font-medium tracking-wide text-[#d7f5ed]">
                      Trusted by 1,200+ verified customers across India
                    </p>
                  </div>
                </aside>

                <div className="grid gap-4 sm:grid-cols-2">
                  {REVIEW_SHOWCASE.slice(0, 2).map((review, i) => (
                    <article
                      key={review.author}
                      className="rounded-2xl border border-[#8bbdb835] bg-[#f5f7f3] p-5 shadow-[0_20px_45px_rgba(2,10,20,0.35)]"
                      data-reveal
                      style={{ transitionDelay: `${110 + i * 45}ms` }}
                    >
                      <div className="text-3xl leading-none text-[#1c6a67]" aria-hidden>
                        "
                      </div>
                      <p className="mt-2 text-sm leading-7 text-[#234f4f]">{review.text}</p>
                      <div className="mt-5 flex items-center gap-3">
                        <span
                          className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${
                            REVIEW_AVATAR_BACKGROUNDS[i % REVIEW_AVATAR_BACKGROUNDS.length]
                          }`}
                        >
                          {review.initials}
                        </span>
                        <div>
                          <p className="text-base font-semibold text-[#123f43]">{review.author}</p>
                          <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-[#1a605d]">
                            <span className="h-2 w-2 rounded-full bg-[#f7a640]" aria-hidden />
                            {review.rating}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}

                  <article
                    className="rounded-2xl border border-[#8bbdb835] bg-[#f5f7f3] p-5 shadow-[0_20px_45px_rgba(2,10,20,0.35)]"
                    data-reveal
                    style={{ transitionDelay: "210ms" }}
                  >
                    <div className="text-3xl leading-none text-[#1c6a67]" aria-hidden>
                      "
                    </div>
                    <p className="mt-2 text-sm leading-7 text-[#234f4f]">{REVIEW_SHOWCASE[2].text}</p>
                    <div className="mt-5 flex items-center gap-3">
                      <span className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white ${REVIEW_AVATAR_BACKGROUNDS[2]}`}>
                        {REVIEW_SHOWCASE[2].initials}
                      </span>
                      <div>
                        <p className="text-base font-semibold text-[#123f43]">{REVIEW_SHOWCASE[2].author}</p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-[#1a605d]">
                          <span className="h-2 w-2 rounded-full bg-[#f7a640]" aria-hidden />
                          {REVIEW_SHOWCASE[2].rating}
                        </div>
                      </div>
                    </div>
                  </article>

                  <article
                    className="relative overflow-hidden rounded-2xl border border-[#7fbeff42] bg-[linear-gradient(150deg,#112f4f_0%,#102742_48%,#0a1b2e_100%)] p-5 shadow-[0_20px_45px_rgba(2,10,20,0.35)]"
                    data-reveal
                    style={{ transitionDelay: "250ms" }}
                  >
                    <div className="pointer-events-none absolute -right-16 -top-16 h-36 w-36 rounded-full bg-[#5ec7ff2e] blur-3xl" aria-hidden />
                    <div className="pointer-events-none absolute -left-12 bottom-[-40px] h-28 w-28 rounded-full bg-[#6bf2df1f] blur-2xl" aria-hidden />
                    <div className="relative flex h-full min-h-[220px] flex-col justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9fd1ff]">Store Experience</p>
                        <h3 className="mt-3 max-w-[18ch] text-2xl font-semibold leading-snug text-[#ecf3ff]">
                          In-store guidance with online convenience
                        </h3>
                        <p className="mt-3 max-w-[26ch] text-sm leading-7 text-[#bfd3ea]">
                          Our team helps with part compatibility, setup clarity, and post-purchase support.
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="Previous review"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#7fbeff55] bg-[#0a1b2f66] text-[#d6e8ff] transition hover:border-[#a7d3ff] hover:bg-[#12365a]"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="m15 18-6-6 6-6" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          aria-label="Next review"
                          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#7fbeff55] bg-[#0a1b2f66] text-[#d6e8ff] transition hover:border-[#a7d3ff] hover:bg-[#12365a]"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

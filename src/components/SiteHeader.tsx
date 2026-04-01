import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { navCategories } from "../data/categories";

type MenuItem = {
  to: string;
  title: string;
  subtext?: string;
  icon: string;
};

const accountItems: MenuItem[] = [
  {
    to: "/account",
    title: "My Profile",
    subtext: "Edit your basic details",
    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
  },
  {
    to: "/account/address",
    title: "My Address",
    subtext: "Manage your saved addresses",
    icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
  },
  {
    to: "/account/orders",
    title: "My Orders",
    subtext: "View, track, cancel orders and buy again",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    to: "/account/offers",
    title: "My Rewards",
    subtext: "Exclusive offers and loyalty rewards for you",
    icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7",
  },
  {
    to: "/wishlist",
    title: "My Wishlist",
    subtext: "Have a look at your favourite products",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  {
    to: "/account/devices",
    title: "My Devices & Plans",
    subtext: "Manage your devices and plans",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    to: "/account/requests",
    title: "My Service Requests",
    subtext: "Manage complaints, feedback, service requests",
    icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
  },
];

const loggedOutItems: MenuItem[] = [
  {
    to: "/account/orders",
    title: "My Orders",
    icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
  },
  {
    to: "/wishlist",
    title: "My Wishlist",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
];

function DropdownLink({ item }: { item: MenuItem }) {
  return (
    <li>
      <Link
        to={item.to}
        className="flex items-start gap-3 px-3 py-2 text-sm transition hover:bg-white/5"
      >
        <div className="mt-0.5 text-[#b4c1d3]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-[#ecf3ff]">{item.title}</span>
          {item.subtext ? <span className="text-xs text-[#a8b6ca]">{item.subtext}</span> : null}
        </div>
      </Link>
    </li>
  );
}

export default function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, loading: authLoading, signOut } = useAuth();
  const headerRef = useRef<HTMLElement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartPulse, setCartPulse] = useState(false);
  const cartPulseTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const updateHeaderHeight = () => {
      const height = headerRef.current?.offsetHeight ?? 120;
      document.documentElement.style.setProperty("--site-header-height", `${height}px`);
    };

    updateHeaderHeight();

    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && headerRef.current) {
      observer = new ResizeObserver(updateHeaderHeight);
      observer.observe(headerRef.current);
    }

    window.addEventListener("resize", updateHeaderHeight);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    if (count <= 0) return;
    setCartPulse(true);
    if (cartPulseTimerRef.current != null) {
      window.clearTimeout(cartPulseTimerRef.current);
    }
    cartPulseTimerRef.current = window.setTimeout(() => {
      setCartPulse(false);
    }, 420);
  }, [count]);

  useEffect(() => {
    return () => {
      if (cartPulseTimerRef.current != null) {
        window.clearTimeout(cartPulseTimerRef.current);
      }
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(q ? `/category/all?q=${encodeURIComponent(q)}` : "/category/all");
    }
  };

  const displayName =
    user?.firstName?.trim() ||
    (user?.username ? user.username.split(" ")[0] : undefined) ||
    "there";

  const accountHref = user?.role === "admin" ? "/admin" : "/account";
  const iconBtnClass =
    "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#2a3f5d] text-[#ecf3ff] transition hover:border-[#5ec7ff] hover:text-[#5ec7ff]";

  return (
    <header ref={headerRef} className="sticky top-0 z-40 border-b border-[#2a3f5d] bg-[#050812]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-5 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-2 text-[#ecf3ff]">
          <img src="/shivam-logo1.webp" alt="" className="h-9 w-9 object-contain" />
          <span className="text-lg font-semibold tracking-tight">Shivam Computer</span>
        </Link>

        <form className="hidden flex-1 md:block" onSubmit={handleSearch}>
          <input
            type="search"
            className="w-full rounded-full border border-[#2a3f5d] bg-transparent px-4 py-2 text-sm text-[#ecf3ff] outline-none transition placeholder:text-[#a8b6ca] focus:border-[#5ec7ff]"
            placeholder="Search laptops, gaming PC, CPU, GPU, RAM, SSD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className="ml-auto flex items-center gap-2">
          <div className="group relative">
            {!authLoading && user ? (
              <>
                <Link
                  to={accountHref}
                  className="inline-flex items-center gap-2 rounded-full border border-[#2a3f5d] px-3 py-2 text-sm text-[#ecf3ff] transition hover:border-[#5ec7ff] hover:text-[#5ec7ff]"
                  title="Account"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="hidden sm:inline">Hi {displayName}</span>
                </Link>

                <div className="invisible absolute right-0 top-full z-50 w-[320px] pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-[#2a3f5d] bg-[#0f1625] shadow-xl">
                    <ul className="max-h-[420px] overflow-auto py-1">
                      {accountItems.map((item) => (
                        <DropdownLink key={item.to} item={item} />
                      ))}
                      <li className="border-t border-[#2a3f5d]">
                        <button
                          type="button"
                          className="flex w-full items-start gap-3 px-3 py-2 text-left text-sm transition hover:bg-[#f87171]/10"
                          onClick={() => {
                            void signOut();
                          }}
                        >
                          <div className="mt-0.5 text-[#f87171]">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                            </svg>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-[#fca5a5]">Logout</span>
                            <span className="text-xs text-[#fca5a5]">Sign out of your account</span>
                          </div>
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={iconBtnClass}
                  title="Account / Login"
                  aria-label="Account / Login"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>

                <div className="invisible absolute right-0 top-full z-50 w-72 pt-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-xl border border-[#2a3f5d] bg-[#0f1625]">
                    <div className="border-b border-[#2a3f5d] px-4 py-3">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#a8b6ca]">My Account</p>
                      <Link
                        to="/login"
                        className="mt-2 inline-flex rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-4 py-2 text-xs font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
                      >
                        Login / Sign Up
                      </Link>
                    </div>
                    <ul className="py-1">
                      {loggedOutItems.map((item) => (
                        <DropdownLink key={item.to} item={item} />
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </div>

          <Link to="/wishlist" className={iconBtnClass} title="Wishlist" aria-label="Wishlist">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#45d39c] px-1 text-[10px] font-bold text-[#050812]">
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/cart" className={iconBtnClass} title="Cart" aria-label="Cart">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {count > 0 && (
              <span
                className={`absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#f85149] px-1 text-[10px] font-bold text-white ${
                  cartPulse ? "motion-safe:animate-[cartBadgePulse_0.42s_cubic-bezier(0.22,1,0.36,1)]" : ""
                }`}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="border-t border-[#2a3f5d] bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-start gap-2 overflow-x-auto px-4 py-2.5 sm:justify-center [&::-webkit-scrollbar]:hidden">
          {navCategories.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`whitespace-nowrap rounded-full px-4 py-1.5 text-[13px] font-semibold tracking-[0.01em] transition ${
                location.pathname === path
                  ? "bg-[linear-gradient(90deg,rgba(94,199,255,0.28),rgba(34,197,94,0.18))] text-[#b8e6ff] shadow-[inset_0_0_0_1px_rgba(94,199,255,0.48)]"
                  : "text-[#d5deec] hover:bg-[#ffffff12] hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

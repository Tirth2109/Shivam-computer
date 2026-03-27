import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { navCategories } from "../data/categories";

export default function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { user, loading: authLoading, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartPulse, setCartPulse] = useState(false);
  const cartPulseTimerRef = useRef<number | null>(null);

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

  return (
    <header className="site-header">
      <div className="header-top">
        <Link to="/" className="header-logo">
          <img src="/shivam-logo1.webp" alt="" className="logo-img" />
          <span className="logo-text">Shivam Computer</span>
        </Link>

        <form className="header-search-wrap" onSubmit={handleSearch}>
          <input
            type="search"
            className="header-search"
            placeholder="Search laptops, gaming PC, CPU, GPU, RAM, SSD…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search products"
          />
        </form>

        <div className="header-actions">
          <div className="header-account-container">
            {!authLoading && user ? (
              <div className="header-user-wrapper">
                <Link
                  to={accountHref}
                  className="header-user-greeting"
                  title="Account"
                >
                  <svg className="user-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Hi {displayName}</span>
                </Link>
                <div className="account-dropdown">
                  <div className="dropdown-arrow"></div>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/account" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Profile</span>
                          <span className="item-subtext">Edit your basic details</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/address" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Address</span>
                          <span className="item-subtext">Manage your saved addresses</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/orders" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Orders</span>
                          <span className="item-subtext">View, track, cancel orders and buy again</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/offers" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Rewards</span>
                          <span className="item-subtext">Exclusive offers and loyalty rewards for you</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/wishlist" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Wishlist</span>
                          <span className="item-subtext">Have a look at your favourite products</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/devices" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Devices & Plans</span>
                          <span className="item-subtext">Manage your devices and plans</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/account/requests" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Service Requests</span>
                          <span className="item-subtext">Manage complaints, feedback, service requests</span>
                        </div>
                      </Link>
                    </li>
                    <li className="dropdown-logout">
                      <button
                        type="button"
                        className="dropdown-item logout-btn"
                        onClick={() => {
                          void signOut();
                        }}
                      >
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                          </svg>
                        </div>
                        <div className="item-text">
                           <span className="item-title">Logout</span>
                           <span className="item-subtext">Sign out of your account</span>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="header-user-wrapper">
                <Link
                  to="/login"
                  className="header-icon-btn"
                  title="Account / Login"
                  aria-label="Account / Login"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </Link>
                <div className="account-dropdown logged-out">
                  <div className="dropdown-arrow"></div>
                  <div className="dropdown-login-prompt">
                    <p>My Account</p>
                    <Link to="/login" className="btn primary login-btn">Login / Sign Up</Link>
                  </div>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/account/orders" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Orders</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link to="/wishlist" className="dropdown-item">
                        <div className="item-icon">
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        <div className="item-text">
                          <span className="item-title">My Wishlist</span>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>


          <Link
            to="/wishlist"
            className="header-icon-btn"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </Link>

          <Link
            to="/cart"
            className="header-icon-btn"
            title="Cart"
            aria-label="Cart"
            style={{ position: "relative" }}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {count > 0 && (
              <span className={`cart-count ${cartPulse ? "cart-count-pop" : ""}`}>
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>
        </div>
      </div>

      <div className="header-nav-wrap">
        <nav className="header-nav">
          {navCategories.map(({ label, path }) => (
            <Link
              key={path}
              to={path}
              className={`header-link ${location.pathname === path ? "active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { navCategories } from "../data/categories";

export default function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      navigate(q ? `/category/all?q=${encodeURIComponent(q)}` : "/category/all");
    }
  };

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
          <div className="account-dropdown-wrapper">
            <Link to={user ? "/account" : "/login"} className="header-icon-btn" title={user ? "Account" : "Login"} aria-label={user ? "Account" : "Login"}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </Link>
            
            <div className="account-dropdown">
              <Link to="/account" className="account-dropdown-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                <div className="account-dropdown-text">
                  <strong>My Profile</strong>
                  <span>Edit your basic details</span>
                </div>
              </Link>
              <Link to="/account/address" className="account-dropdown-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div className="account-dropdown-text">
                  <strong>My Address</strong>
                  <span>Manage your saved addresses</span>
                </div>
              </Link>
              <Link to="/account/orders" className="account-dropdown-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                <div className="account-dropdown-text">
                  <strong>My Orders</strong>
                  <span>View, track, cancel orders and buy again</span>
                </div>
              </Link>
              <Link to="/account/offers" className="account-dropdown-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                <div className="account-dropdown-text">
                  <strong>My Privilege Offers</strong>
                  <span>Exclusive offers for you</span>
                </div>
              </Link>
              <Link to="/wishlist" className="account-dropdown-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <div className="account-dropdown-text">
                  <strong>My Wishlist</strong>
                  <span>Have a look at your favourite products</span>
                </div>
              </Link>
              <Link to="/account/devices" className="account-dropdown-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <div className="account-dropdown-text">
                  <strong>My Devices & Plans</strong>
                  <span>Manage your devices and plans</span>
                </div>
              </Link>
              <Link to="/account/requests" className="account-dropdown-item">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                <div className="account-dropdown-text">
                  <strong>My Service Requests</strong>
                  <span>Manage complaints, feedback, service requests</span>
                </div>
              </Link>
              {!user ? (
                <Link to="/login" className="account-dropdown-item">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
                  <div className="account-dropdown-text">
                    <strong>Login</strong>
                    <span>Sign in to your account</span>
                  </div>
                </Link>
              ) : (
                <button 
                  onClick={async () => {
                    await logout();
                    navigate("/login");
                  }} 
                  className="account-dropdown-item logout-btn"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  <div className="account-dropdown-text">
                    <strong>Logout</strong>
                    <span>Sign out of your account</span>
                  </div>
                </button>
              )}
            </div>
          </div>
          <Link to="/wishlist" className="header-icon-btn" title="Wishlist" aria-label="Wishlist">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
          </Link>
          <Link to="/cart" className="header-icon-btn" title="Cart" aria-label="Cart" style={{ position: "relative" }}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            {count > 0 && <span className="cart-count">{count > 99 ? "99+" : count}</span>}
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

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { navCategories } from "../data/categories";

export default function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const { count } = useCart();
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
          <img src="/shivam-logo.webp" alt="" className="logo-img" />
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
          <Link to="/login" className="header-icon-btn" title="Account / Login" aria-label="Account / Login">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </Link>
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

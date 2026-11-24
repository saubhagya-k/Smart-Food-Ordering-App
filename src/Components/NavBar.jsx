import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FiShoppingBag, FiMapPin, FiUser, FiLogOut } from "react-icons/fi";
import Logo from "./Logo";
import { API_URL } from "./../../Utils/api";

export function initials(user) {
  const name = (user?.username || user?.email || "?").trim();
  const parts = name.split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] || "?") + (parts[1]?.[0] || "")).toUpperCase();
}

// Shared top bar for every page.
export default function NavBar({ user, setUser, setShowLogin, cartCount = 0 }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
    setUser?.(null);
    setOpen(false);
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `hidden md:inline text-sm font-semibold ${isActive ? "text-paprika-600" : "text-stone-warm hover:text-ink"}`;

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-5">
          <Logo />
          <span className="hidden md:flex items-center gap-1 text-sm text-stone-warm">
            <FiMapPin className="text-paprika-600" /> Patna
          </span>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <NavLink to="/restaurent" className={linkClass}>Restaurants</NavLink>

          <Link
            to="/checkout"
            aria-label={`Cart, ${cartCount} items`}
            className="relative flex items-center gap-2 text-ink hover:text-paprika-600"
          >
            <FiShoppingBag size={20} />
            <span className="hidden md:inline text-sm font-semibold">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 md:static min-w-5 h-5 px-1 rounded-full bg-paprika-600 text-white text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setOpen((v) => !v)}
                aria-label="Account menu"
                className="w-9 h-9 rounded-full bg-paprika-600 text-white text-sm font-bold flex items-center justify-center ring-2 ring-paprika-100"
              >
                {initials(user)}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-lg border border-line overflow-hidden">
                  <div className="px-4 py-3 border-b border-line">
                    <p className="text-sm font-bold text-ink truncate">{user.username}</p>
                    <p className="text-xs text-stone-warm truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-cream">
                    <FiUser /> Profile & orders
                  </Link>
                  <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-paprika-700 hover:bg-cream">
                    <FiLogOut /> Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/profile" className="hidden sm:inline text-sm font-semibold text-stone-warm hover:text-ink">Orders</Link>
              <button
                onClick={() => setShowLogin?.(true)}
                className="bg-ink text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-black"
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

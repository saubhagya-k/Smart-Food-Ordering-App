import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogOut, FiClock, FiShoppingBag, FiArrowRight, FiCreditCard, FiSmartphone, FiHome } from "react-icons/fi";
import { PiChartPieSliceBold } from "react-icons/pi";
import { initials } from "./NavBar";
import { getOrders, ownerKey } from "../../Utils/orderHistory";
import { API_URL } from "./../../Utils/api";

const PAYMENT = {
  card: { label: "Card", icon: FiCreditCard },
  upi: { label: "UPI", icon: FiSmartphone },
  netbanking: { label: "Net banking", icon: FiHome },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });

const rupees = (n) => "₹" + Math.round(n || 0).toLocaleString("en-IN");

function Stat({ label, value }) {
  return (
    <div className="bg-white rounded-2xl border border-line px-4 py-3">
      <p className="text-xl md:text-2xl font-extrabold text-ink truncate">{value}</p>
      <p className="text-xs text-stone-warm mt-0.5">{label}</p>
    </div>
  );
}

function OrderCard({ order }) {
  const pay = PAYMENT[order.paymentMethod];
  const PayIcon = pay?.icon || FiCreditCard;
  const photos = order.items.filter((i) => i.image).slice(0, 4);
  const itemCount = order.items.reduce((n, i) => n + i.qty, 0);

  return (
    <article className="bg-white rounded-3xl border border-line p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-bold text-ink truncate">{order.restaurants?.length ? order.restaurants.join(", ") : "Your order"}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-stone-warm">
            <FiClock size={12} /> {formatDate(order.createdAt)}
          </p>
        </div>
        <span className="shrink-0 text-xs font-bold bg-basil-50 text-basil-700 px-2.5 py-1 rounded-full">{order.status}</span>
      </div>

      {photos.length > 0 && (
        <div className="mt-4 flex -space-x-3">
          {photos.map((item) => (
            <img key={item.id} src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-white bg-cream" />
          ))}
        </div>
      )}

      <ul className="mt-3 text-sm text-ink space-y-0.5">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-3">
            <span className="truncate"><span className="font-semibold">{item.qty} ×</span> {item.name}</span>
            <span className="shrink-0 text-stone-warm">₹{item.price * item.qty}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 pt-3 border-t border-line flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-warm">
        <span className="flex items-center gap-1"><PayIcon size={13} /> {pay?.label || "Paid"}</span>
        <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
        {order.calories != null && (
          <span className="flex items-center gap-1 text-basil-700"><PiChartPieSliceBold size={13} /> ~{Math.round(order.calories)} kcal</span>
        )}
        <span className="ml-auto text-sm font-extrabold text-ink">{rupees(order.total)}</span>
      </div>
      <p className="mt-2 text-[11px] tracking-wide text-stone-warm">ORDER {order.id}</p>
    </article>
  );
}

const Profile = ({ user, setUser, setShowLogin }) => {
  const navigate = useNavigate();
  const [checkingLogin, setCheckingLogin] = useState(!user);
  const [orders, setOrders] = useState(null); // null = loading
  const [error, setError] = useState("");

  // The app checks the login 10 s after it opens; on this page, check right away
  useEffect(() => {
    if (user) {
      setCheckingLogin(false);
      return;
    }
    let cancelled = false;
    fetch(`${API_URL}/auth/me`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data?.user) setUser?.(data.user);
      })
      .catch(() => {})
      .finally(() => !cancelled && setCheckingLogin(false));
    return () => {
      cancelled = true;
    };
  }, [user, setUser]);

  // Load this account's (or the guest's) orders from IndexedDB
  useEffect(() => {
    if (checkingLogin) return;
    setOrders(null);
    getOrders(ownerKey(user))
      .then(setOrders)
      .catch((err) => {
        console.warn(err);
        setError("Order history isn't available in this browser.");
        setOrders([]);
      });
  }, [user, checkingLogin]);

  const logout = () => {
    fetch(`${API_URL}/logout`, { method: "POST", credentials: "include" });
    setUser?.(null);
    navigate("/");
  };

  if (checkingLogin) {
    return (
      <div className="py-24 text-center">
        <div className="mx-auto w-10 h-10 rounded-full border-4 border-paprika-100 border-t-paprika-600 animate-spin" />
      </div>
    );
  }

  const list = orders || [];
  const spent = list.reduce((t, o) => t + (o.total || 0), 0);
  const counts = {};
  list.forEach((o) => (o.restaurants || []).forEach((r) => (counts[r] = (counts[r] || 0) + 1)));
  const favourite = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="pb-16">
      {/* Account header */}
      <section className="grain bg-cream border-b border-line">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-10">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-paprika-600 text-white text-2xl md:text-3xl font-bold flex items-center justify-center ring-4 ring-white shadow-sm shrink-0">
              {user ? initials(user) : "G"}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl md:text-4xl text-ink truncate capitalize">{user ? user.username : "Guest"}</h1>
              <p className="text-stone-warm truncate">{user ? user.email : "You're browsing without an account"}</p>
            </div>
            {user ? (
              <button onClick={logout} className="hidden sm:flex items-center gap-2 text-sm font-semibold text-paprika-700 border border-paprika-200 bg-white rounded-full px-4 py-2 hover:bg-paprika-50">
                <FiLogOut /> Log out
              </button>
            ) : (
              <button onClick={() => setShowLogin?.(true)} className="hidden sm:block text-sm font-semibold bg-ink text-white rounded-full px-5 py-2.5 hover:bg-black">
                Sign in
              </button>
            )}
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <Stat label="Orders" value={orders ? list.length : "–"} />
            <Stat label="Spent" value={orders ? rupees(spent) : "–"} />
            <Stat label="Favourite" value={favourite || "–"} />
          </div>
        </div>
      </section>

      {/* Order history */}
      <section className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-paprika-700">Order history</p>
            <h2 className="mt-1 font-display text-3xl text-ink">Your past orders</h2>
          </div>
          <p className="hidden sm:block text-xs text-stone-warm text-right max-w-[14rem]">Saved in this browser (IndexedDB), only visible to you on this device.</p>
        </div>

        {!user && (
          <p className="mt-4 text-sm bg-paprika-50 text-paprika-800 rounded-2xl px-4 py-3">
            These are guest orders from this browser. <button onClick={() => setShowLogin?.(true)} className="font-bold underline">Sign in</button> to keep orders under your account.
          </p>
        )}
        {error && <p className="mt-4 text-sm text-paprika-700">{error}</p>}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {orders === null && <p className="text-stone-warm">Loading your orders…</p>}
          {orders?.map((order) => <OrderCard key={order.id} order={order} />)}
        </div>

        {orders?.length === 0 && !error && (
          <div className="mt-2 py-14 px-6 text-center bg-cream border border-line rounded-3xl">
            <FiShoppingBag size={28} className="mx-auto text-paprika-600" />
            <p className="mt-3 font-display text-2xl text-ink">No orders yet</p>
            <p className="mt-1 text-stone-warm">When you place an order, it shows up here.</p>
            <Link to="/restaurent" className="inline-flex items-center gap-2 mt-5 bg-paprika-600 hover:bg-paprika-700 text-white font-semibold rounded-full px-5 py-2.5 text-sm">
              Find something to eat <FiArrowRight />
            </Link>
          </div>
        )}

        {user ? (
          <button onClick={logout} className="sm:hidden mt-8 w-full flex items-center justify-center gap-2 text-sm font-semibold text-paprika-700 border border-paprika-200 rounded-2xl py-3">
            <FiLogOut /> Log out
          </button>
        ) : (
          <button onClick={() => setShowLogin?.(true)} className="sm:hidden mt-8 w-full text-sm font-semibold bg-ink text-white rounded-2xl py-3">
            Sign in
          </button>
        )}
      </section>
    </div>
  );
};

export default Profile;

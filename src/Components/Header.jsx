import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiSearch, FiArrowRight } from "react-icons/fi";
import { MdDeliveryDining, MdLocalGroceryStore, MdRestaurant } from "react-icons/md";
import { PiChartPieSliceBold, PiClockCounterClockwiseBold, PiUserCircleDashedBold } from "react-icons/pi";
import { mockPagination } from "../../Utils/mockPagination";

const IMG = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600/";

// Three dish photos from local restaurants in the saved list for the hero
// collage (big chains are skipped: their photos are logo-heavy ads)
const CHAINS = /burger king|kfc|mcdonald|subway|domino|pizza hut|baskin|starbucks/i;
const heroPhotos = mockPagination
  .flatMap((page) => page?.restaurants || [])
  .filter((r) => r?.info?.cloudinaryImageId && !CHAINS.test(r.info.name || ""))
  .slice(0, 3)
  .map((r) => ({ src: IMG + r.info.cloudinaryImageId, name: r.info.name }));

const services = [
  { to: "/restaurent", icon: MdDeliveryDining, title: "Food delivery", text: "60+ local restaurants" },
  { href: "#groceries", icon: MdLocalGroceryStore, title: "Groceries", text: "Fresh produce & staples" },
  { href: "#dine-out", icon: MdRestaurant, title: "Dine out", text: "Places worth the trip" },
];

const features = [
  { icon: PiChartPieSliceBold, title: "Nutrition before you pay", text: "AI estimates calories, protein, carbs and fat for your cart." },
  { icon: PiClockCounterClockwiseBold, title: "Your order history", text: "Every order is saved on your device and shown in your profile." },
  { icon: PiUserCircleDashedBold, title: "Try it as a guest", text: "Browse for 15 minutes without making an account." },
];

// Home page hero (the top bar is NavBar)
export default function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const search = (e) => {
    e.preventDefault();
    navigate("/restaurent");
  };

  return (
    <header>
      <section className="grain bg-cream border-b border-line">
        <div className="max-w-7xl mx-auto px-4 py-10 md:py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-paprika-700">Delivering across Patna</p>
            <h1 className="mt-3 font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-ink">
              Real food from local kitchens, <span className="italic text-paprika-600">at your door.</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-stone-warm max-w-xl">
              Order from restaurants near you, check the nutrition before you pay, and keep every order in one place.
            </p>

            <form onSubmit={search} className="mt-7 flex items-center gap-2 bg-white rounded-full border border-line shadow-sm p-1.5 max-w-xl">
              <FiSearch className="ml-3 text-stone-warm shrink-0" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-base py-2"
                placeholder="Biryani, pizza, a restaurant…"
                aria-label="Search food or restaurants"
              />
              <button className="shrink-0 bg-paprika-600 hover:bg-paprika-700 text-white font-semibold rounded-full px-5 py-2.5 text-sm">
                Find food
              </button>
            </form>
          </div>

          {/* Photo collage: only where there's room for it */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {heroPhotos.map((p, i) => (
              <figure
                key={p.src}
                className={`overflow-hidden rounded-3xl border-4 border-white shadow-md bg-white ${i === 0 ? "row-span-2 h-[22rem]" : "h-[10.5rem]"}`}
              >
                <img src={p.src} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* What you can do here */}
      <section className="max-w-7xl mx-auto px-4 -mt-0 md:-mt-8 relative">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-5 pt-6 md:pt-0">
          {services.map(({ to, href, icon: Icon, title, text }) => {
            const body = (
              <>
                <span className="w-12 h-12 rounded-2xl bg-paprika-50 text-paprika-600 flex items-center justify-center">
                  <Icon size={26} />
                </span>
                <span className="flex-1">
                  <span className="block font-bold text-ink">{title}</span>
                  <span className="block text-sm text-stone-warm">{text}</span>
                </span>
                <FiArrowRight className="text-stone-warm group-hover:text-paprika-600 group-hover:translate-x-0.5 transition" />
              </>
            );
            const cls = "group flex items-center gap-4 bg-white rounded-2xl border border-line p-4 md:p-5 shadow-sm hover:shadow-md hover:border-paprika-200 transition";
            return to ? (
              <Link key={title} to={to} className={cls}>{body}</Link>
            ) : (
              <a key={title} href={href} className={cls}>{body}</a>
            );
          })}
        </div>
      </section>

      {/* What makes this project different */}
      <section className="max-w-7xl mx-auto px-4 mt-10 md:mt-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 border-y border-line py-8">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3">
              <Icon size={26} className="text-basil-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-ink">{title}</p>
                <p className="text-sm text-stone-warm mt-0.5">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </header>
  );
}

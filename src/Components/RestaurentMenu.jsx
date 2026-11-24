import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FiSearch, FiStar, FiClock } from "react-icons/fi";
import MenuCard from "./MenuCard";
import { API_URL } from "./../../Utils/api";
import { mockPagination } from "../../Utils/mockPagination";

// Restaurant details from the saved list, used when the API doesn't send them
function savedRestaurant(id) {
  for (const page of mockPagination) {
    const found = page?.restaurants?.find((r) => String(r?.info?.id) === String(id));
    if (found) return found.info;
  }
  return null;
}

export default function RestaurantMenu({ setCartCount, cartItems, setCartItems }) {
  const { id } = useParams();

  const [RestData, setRestData] = useState([]);
  const [restaurant, setRestaurant] = useState(() => savedRestaurant(id));
  const [status, setStatus] = useState("loading"); // "loading" | "done"
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setStatus("loading");
    setRestaurant(savedRestaurant(id));

    async function fetchData() {
      const url = `${API_URL}/api/swiggy/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const cards = data?.data?.cards || [];

        // Restaurant name, rating etc.
        const info = cards.find((c) => c?.card?.card?.info?.name)?.card?.card?.info;
        if (info) setRestaurant(info);

        // The card that holds the menu sections
        const menuCard = cards.find((card) => card?.groupedCard?.cardGroupMap?.REGULAR?.cards);
        const regularCards = menuCard?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];
        setRestData(regularCards.filter((items) => "title" in (items?.card?.card || {})));
      } catch (err) {
        console.warn("Error fetching menu data:", err);
        setRestData([]);
      } finally {
        setStatus("done");
      }
    }

    fetchData();
  }, [id]);

  const filterClass = (active, tone) =>
    `flex items-center gap-2 text-sm font-semibold py-2 px-4 rounded-full border transition ${
      active ? `${tone} text-white border-transparent` : "bg-white text-ink border-line hover:border-stone-warm"
    }`;

  const cartRestaurant = { id, name: restaurant?.name || null };

  return (
    <div className="pb-24">
      {/* Restaurant header */}
      <section className="grain bg-cream border-b border-line">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link to="/restaurent" className="text-sm font-semibold text-stone-warm hover:text-ink">← All restaurants</Link>
          <h1 className="mt-2 font-display text-3xl md:text-5xl text-ink">{restaurant?.name || "Menu"}</h1>
          {restaurant && (
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
              {restaurant.avgRating && (
                <span className="flex items-center gap-1 bg-basil-50 text-basil-700 font-bold px-2 py-0.5 rounded-md">
                  <FiStar size={13} className="fill-basil-500 text-basil-500" /> {restaurant.avgRating}
                  {restaurant.totalRatingsString && <span className="font-medium text-stone-warm">· {restaurant.totalRatingsString}</span>}
                </span>
              )}
              {restaurant?.sla?.slaString && (
                <span className="flex items-center gap-1 text-stone-warm"><FiClock size={14} /> {restaurant.sla.slaString}</span>
              )}
              {restaurant.costForTwoMessage && <span className="text-stone-warm">{restaurant.costForTwoMessage}</span>}
            </div>
          )}
          {restaurant?.cuisines && <p className="mt-2 text-stone-warm">{restaurant.cuisines.join(", ")}</p>}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 mt-6">
        <Link
          to={`/city/chennai/${id}/search`}
          className="flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white border border-line text-stone-warm hover:border-stone-warm"
        >
          <FiSearch /> Search this menu
        </Link>

        <div className="mt-5 flex gap-3">
          <button className={filterClass(selected === "Veg", "bg-basil-600")} onClick={() => setSelected(selected === "Veg" ? null : "Veg")}>
            <span className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-current" /></span>
            Veg only
          </button>
          <button className={filterClass(selected === "Non Veg", "bg-paprika-700")} onClick={() => setSelected(selected === "Non Veg" ? null : "Non Veg")}>
            <span className="w-3 h-3 rounded-sm border-2 border-current flex items-center justify-center"><span className="w-1 h-1 rounded-full bg-current" /></span>
            Non-veg
          </button>
        </div>

        <div className="mt-8">
          {status === "loading" && (
            <div className="py-16 text-center">
              <div className="mx-auto w-10 h-10 rounded-full border-4 border-paprika-100 border-t-paprika-600 animate-spin" />
              <p className="mt-4 text-stone-warm">Loading the menu…</p>
            </div>
          )}

          {status === "done" && RestData.length === 0 && (
            <div className="py-14 px-6 text-center bg-cream border border-line rounded-3xl">
              <p className="font-display text-2xl text-ink">The menu isn't available right now</p>
              <p className="mt-2 text-stone-warm">The menu source didn't respond. Please try again in a little while, or pick another restaurant.</p>
              <Link to="/restaurent" className="inline-block mt-5 bg-ink text-white font-semibold rounded-full px-5 py-2.5 text-sm">Browse restaurants</Link>
            </div>
          )}

          {RestData.map((menuItems) => (
            <MenuCard
              key={menuItems?.card?.card?.title}
              menuItems={menuItems?.card?.card}
              foodselected={selected}
              setCartCount={setCartCount}
              cartItems={cartItems}
              setCartItems={setCartItems}
              restaurant={cartRestaurant}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

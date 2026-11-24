import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import RestInfo from "./RestInfo";
import { API_URL } from './../../Utils/api';

// Every dish in the menu, including dishes inside sub-sections
function allDishes(sections) {
    const dishes = [];
    for (const section of sections) {
        const card = section?.card?.card || section;
        (card?.itemCards || []).forEach((item) => item?.card?.info && dishes.push(item.card.info));
        (card?.categories || []).forEach((sub) =>
            (sub?.itemCards || []).forEach((item) => item?.card?.info && dishes.push(item.card.info))
        );
    }
    // the same dish can appear in two sections
    return Array.from(new Map(dishes.map((d) => [d.id, d])).values());
}

export default function SearchFood({ setCartCount, cartItems, setCartItems }) {
    const { id } = useParams();
    const [food, setFood] = useState("");
    const [dishes, setDishes] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [status, setStatus] = useState("loading");

    useEffect(() => {
        async function fetchData() {
            try {
                const url = `${API_URL}/api/swiggy/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;
                const data = await (await fetch(url)).json();
                const cards = data?.data?.cards || [];
                const info = cards.find((c) => c?.card?.card?.info?.name)?.card?.card?.info;
                if (info) setRestaurant({ id, name: info.name });
                const menuCard = cards.find((c) => c?.groupedCard?.cardGroupMap?.REGULAR?.cards);
                setDishes(allDishes(menuCard?.groupedCard?.cardGroupMap?.REGULAR?.cards || []));
            } catch (err) {
                console.warn("Error fetching menu data:", err);
            } finally {
                setStatus("done");
            }
        }
        fetchData();
    }, [id]);

    const q = food.trim().toLowerCase();
    const results = q ? dishes.filter((d) => d.name?.toLowerCase().includes(q)) : [];

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <Link to={`/city/chennai/${id}`} className="text-sm font-semibold text-stone-warm hover:text-ink">← Back to menu</Link>
            <h1 className="mt-2 font-display text-3xl md:text-4xl text-ink">
                Search {restaurant?.name ? restaurant.name : "the menu"}
            </h1>

            <label className="mt-5 flex items-center gap-3 w-full px-5 py-3 rounded-full bg-white border border-line focus-within:border-paprika-500">
                <FiSearch className="text-stone-warm" />
                <input
                    autoFocus
                    className="flex-1 bg-transparent outline-none text-base md:text-lg"
                    placeholder="Search for a dish"
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                />
            </label>

            <div className="mt-6">
                {status === "loading" && <p className="text-stone-warm">Loading the menu…</p>}
                {status === "done" && dishes.length === 0 && (
                    <p className="text-stone-warm">The menu isn't available right now, so there's nothing to search.</p>
                )}
                {q && dishes.length > 0 && results.length === 0 && (
                    <p className="text-stone-warm">No dishes match "{food}".</p>
                )}
                {results.map((dish) => (
                    <RestInfo
                        key={dish.id}
                        restData={dish}
                        setCartCount={setCartCount}
                        cartItems={cartItems}
                        setCartItems={setCartItems}
                        restaurant={restaurant || { id, name: null }}
                    />
                ))}
            </div>
        </div>
    )
}

import { useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import RestInfo from "./RestInfo"

// One menu section (e.g. "Recommended"), collapsible. Sections can also
// contain sub-sections ("categories"), which render as nested MenuCards.
export default function MenuCard({ menuItems, foodselected, setCartCount, cartItems, setCartItems, restaurant }) {
    const [isOpen, setIsOpen] = useState(true);
    const shared = { setCartCount, cartItems, setCartItems, restaurant };

    if ("categories" in menuItems) {
        return (
            <section className="w-full mb-6">
                <h3 className="font-display text-2xl md:text-3xl text-ink mb-2">{menuItems.title}</h3>
                {menuItems?.categories?.map((items) => (
                    <MenuCard key={items?.title} menuItems={items} foodselected={foodselected} {...shared} />
                ))}
            </section>
        )
    }

    const items = (menuItems?.itemCards || []).filter((food) => {
        const isVeg = food?.card?.info?.isVeg === 1;
        if (foodselected === "Veg") return isVeg;
        if (foodselected === "Non Veg") return !isVeg;
        return true;
    });

    return (
        <section className="w-full border-b border-line pb-2 mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between py-3 text-left"
            >
                <span className="font-display text-2xl md:text-3xl text-ink">
                    {menuItems.title} <span className="font-sans text-base text-stone-warm">({items.length})</span>
                </span>
                <FiChevronDown size={24} className={`text-stone-warm transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div className="mt-2">
                    {items.map((item) => (
                        <RestInfo key={item?.card?.info?.id} restData={item?.card?.info} {...shared} />
                    ))}
                </div>
            )}
        </section>
    )
}

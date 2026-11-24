import React from 'react'
import { FiStar } from "react-icons/fi";

const IMG = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_300/";

// Veg / non-veg mark (square with a dot), the usual Indian food label
function DietMark({ veg }) {
  const color = veg ? "border-basil-600 text-basil-600" : "border-paprika-700 text-paprika-700";
  return (
    <span title={veg ? "Veg" : "Non-veg"} className={`inline-flex w-4 h-4 border-2 rounded-sm items-center justify-center ${color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
    </span>
  );
}

// One dish on a menu. The quantity comes from the cart itself, so it stays
// right when you leave the page and come back.
export default function RestInfo({ restData, setCartCount, cartItems = [], setCartItems, restaurant }) {
  const price = ("defaultPrice" in restData ? restData.defaultPrice : restData.price) / 100;
  const count = cartItems.find((item) => item.id === restData.id)?.qty || 0;
  const rating = restData?.ratings?.aggregatedRating;

  const adding = () => {
    setCartCount(prev => prev + 1);
    setCartItems(prev => [
      ...prev,
      {
        id: restData.id,
        name: restData.name,
        qty: 1,
        description: restData.description,
        image: restData.imageId ? IMG + restData.imageId : "",
        price,
        restaurantId: restaurant?.id || null,
        restaurantName: restaurant?.name || null,
      }
    ]);
  };

  const increment = () => {
    setCartCount(prev => prev + 1);
    setCartItems(prev => prev.map(item => item.id === restData.id ? { ...item, qty: item.qty + 1 } : item));
  };

  const decrement = () => {
    setCartCount(prev => prev - 1);
    setCartItems(prev =>
      prev
        .map(item => item.id === restData.id ? { ...item, qty: item.qty - 1 } : item)
        .filter(item => item.qty > 0)
    );
  };

  return (
    <article className="flex w-full justify-between gap-4 py-5 border-t border-line first:border-t-0">
      <div className="flex-1 min-w-0">
        <DietMark veg={restData?.isVeg === 1} />
        <p className="mt-1 text-lg md:text-xl font-bold text-ink">{restData?.name}</p>
        <p className="text-base font-semibold text-ink">₹{price}</p>
        {rating?.rating && (
          <p className="mt-1 flex items-center gap-1 text-sm">
            <FiStar size={13} className="fill-basil-500 text-basil-500" />
            <span className="font-bold text-basil-700">{rating.rating}</span>
            {rating.ratingCountV2 && <span className="text-stone-warm">({rating.ratingCountV2})</span>}
          </p>
        )}
        {restData?.description && (
          <p className="mt-2 text-sm text-stone-warm line-clamp-3 md:line-clamp-2">{restData.description}</p>
        )}
      </div>

      <div className="relative shrink-0 w-28 sm:w-36 md:w-40">
        {restData.imageId ? (
          <img className="w-full h-28 sm:h-36 object-cover rounded-2xl bg-cream" loading="lazy" alt={restData?.name || ""} src={IMG + restData.imageId} />
        ) : (
          <div className="w-full h-28 sm:h-36 rounded-2xl bg-cream border border-line" />
        )}
        {/* Centred under the picture, overlapping its bottom edge */}
        {count === 0 ? (
          <button
            onClick={adding}
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-xl text-sm md:text-base font-extrabold tracking-wide text-paprika-600 px-6 py-1.5 md:py-2 shadow-md border border-line bg-white hover:bg-paprika-50"
          >
            ADD
          </button>
        ) : (
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center rounded-xl text-sm md:text-base font-extrabold text-white bg-paprika-600 px-2 py-1.5 md:py-2 shadow-md whitespace-nowrap">
            <button aria-label="Remove one" className="px-2.5" onClick={decrement}>−</button>
            <span className="px-1 min-w-5 text-center">{count}</span>
            <button aria-label="Add one" className="px-2.5" onClick={increment}>+</button>
          </div>
        )}
      </div>
    </article>
  );
}

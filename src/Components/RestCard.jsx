import React from 'react'
import { Link } from "react-router-dom";
import { FiStar, FiClock } from "react-icons/fi";

// One restaurant in the list
export default function RestCard({ restInfo }) {
  const info = restInfo?.info || {};
  const offer = [info?.aggregatedDiscountInfoV3?.header, info?.aggregatedDiscountInfoV3?.subHeader]
    .filter(Boolean)
    .join(" ");

  return (
    <Link to={"/city/chennai/" + info.id} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-cream">
        <img
          className="w-full h-48 sm:h-44 object-cover transition duration-300 group-hover:scale-[1.03]"
          loading="lazy"
          src={`https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_600/${info.cloudinaryImageId}`}
          alt={info.name}
        />
        {offer && (
          <span className="absolute left-3 bottom-3 bg-white text-paprika-700 text-xs font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full shadow-sm">
            {offer}
          </span>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <p className="text-base font-bold text-ink truncate group-hover:text-paprika-700">{info.name}</p>
        <div className="mt-1 flex items-center gap-3 text-sm text-ink">
          {info.avgRating && (
            <span className="flex items-center gap-1 bg-basil-50 text-basil-700 font-bold px-1.5 py-0.5 rounded-md">
              <FiStar size={12} className="fill-basil-500 text-basil-500" /> {info.avgRating}
            </span>
          )}
          {info?.sla?.slaString && (
            <span className="flex items-center gap-1 text-stone-warm">
              <FiClock size={13} /> {info.sla.slaString}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-stone-warm line-clamp-1">{(info.cuisines || []).join(", ")}</p>
      </div>
    </Link>
  );
}

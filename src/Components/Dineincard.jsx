import React from 'react'
import { FiStar, FiMapPin } from 'react-icons/fi'

// A dine-out place (information card)
export default function Dineincard({hotelfood}){
    const info = hotelfood?.info || {}
    return(
        <article className="shrink-0 w-72 sm:w-80 rounded-2xl overflow-hidden bg-white border border-line">
            <div className="relative">
                <img
                    className="w-full h-44 sm:h-48 object-cover"
                    loading="lazy"
                    alt={info.name || ""}
                    src={"https://media-assets.swiggy.com/swiggy/image/upload/"+info?.mediaFiles?.[0]?.url}
                />
                {info?.rating?.value && (
                    <span className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 text-basil-700 text-xs font-bold px-2 py-1 rounded-full">
                        <FiStar className="fill-basil-500 text-basil-500" size={12} /> {info.rating.value}
                    </span>
                )}
            </div>
            <div className="p-4">
                <p className="font-bold text-ink truncate">{info.name}</p>
                <p className="mt-1 text-sm text-stone-warm truncate flex items-center gap-1">
                    <FiMapPin size={13} className="shrink-0" /> {info.locality || info.areaName || "Patna"}
                </p>
            </div>
        </article>
    )
}

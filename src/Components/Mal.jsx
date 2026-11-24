import React from 'react'

// A grocery category tile
export default function Mal({foodMal}){
    return(
        <div className="shrink-0 w-32 sm:w-40">
            <div className="rounded-2xl bg-white border border-line overflow-hidden">
                <img
                    className="w-full aspect-[4/5] object-cover"
                    loading="lazy"
                    alt={foodMal?.action?.text || ""}
                    src={"https://media-assets.swiggy.com/swiggy/image/upload/"+ foodMal?.imageId}
                />
            </div>
            <p className="mt-2 text-sm font-semibold text-ink text-center">{foodMal?.action?.text}</p>
        </div>
    )
}

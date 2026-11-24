import React from 'react'

export default function Mal({foodMal}){
    return(
        <div className="shrink-0 w-28 sm:w-36">
            <a href={foodMal?.action?.link}>
                <img
                    className="w-full aspect-[4/5] object-cover"
                    alt={foodMal?.action?.text || ""}
                    src={"https://media-assets.swiggy.com/swiggy/image/upload/"+ foodMal?.imageId}
                />
                <p className="mt-1 text-sm text-center">{foodMal?.action?.text}</p>
            </a>
        </div>
    )
}

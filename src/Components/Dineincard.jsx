import React from 'react'

export default function Dineincard({hotelfood}){
    return(
        <div className="relative shrink-0 w-72 sm:w-80 rounded-xl overflow-hidden">
            <a target="_blank" rel="noreferrer" href={hotelfood.cta.link}>
                <img
                    className="w-full h-44 sm:h-48 object-cover"
                    alt={hotelfood?.info?.name || ""}
                    src={"https://media-assets.swiggy.com/swiggy/image/upload/"+hotelfood?.info?.mediaFiles[0]?.url}
                />
                <div className="absolute bg-gradient-to-t h-16 from-black bottom-0 left-0 right-0"></div>
                <p className="absolute bottom-3 left-4 right-16 text-lg sm:text-xl text-white font-bold z-10 truncate">{hotelfood?.info?.name}</p>
                <p className="absolute bottom-3 right-4 bg-green-600 text-white text-sm font-bold z-10 px-2 py-0.5 rounded">{hotelfood?.info?.rating?.value}</p>
            </a>
        </div>
    )
}

import React from 'react'

export default function Foodcard({ foodData }) {
    return (
        <a className="block" href={foodData?.action?.link}>
            <img
                className="w-full h-auto"
                alt={foodData?.action?.text || ""}
                src={"https://media-assets.swiggy.com/swiggy/image/upload/"+ foodData?.imageId}
            />
        </a>
    )
}

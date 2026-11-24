import React from 'react'
import { Link } from 'react-router-dom'

// A dish category; opens the restaurant list
export default function Foodcard({ foodData }) {
    return (
        <Link to="/restaurent" className="block rounded-2xl hover:bg-cream transition p-1">
            <img
                className="w-full h-auto"
                loading="lazy"
                alt={foodData?.action?.text || "Food category"}
                src={"https://media-assets.swiggy.com/swiggy/image/upload/"+ foodData?.imageId}
            />
        </Link>
    )
}

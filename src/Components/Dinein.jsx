import React from 'react'

import Dineincard from "./Dineincard"
import {dineoutRestaurants} from '../../Utils/hotels'

export default function Dinein(){
    return(
        <section className="max-w-7xl mx-auto px-4 mt-10 md:mt-16 mb-10">
            <p className="text-xl md:text-2xl font-bold">Discover best restaurants on Dineout</p>

            {/* One swipeable row on every screen size */}
            <div className="flex flex-nowrap overflow-x-auto gap-4 mt-4 md:mt-6 pb-2">{
                dineoutRestaurants.map((hotelfood)=>(<Dineincard key={hotelfood?.info.id} hotelfood={hotelfood} ></Dineincard>))
            }
            </div>
        </section>
    )
}

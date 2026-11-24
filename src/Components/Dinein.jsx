import React from 'react'

import Dineincard from "./Dineincard"
import {dineoutRestaurants} from '../../Utils/hotels'
import { SectionTitle } from './FoodOption'

export default function Dinein(){
    return(
        <section className="max-w-7xl mx-auto px-4 mt-12 md:mt-16 mb-12">
            <SectionTitle id="dine-out" eyebrow="Dine out" title="Places worth the trip" />
            {/* One swipeable row on every screen size */}
            <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-4 mt-6 pb-2">{
                dineoutRestaurants.map((hotelfood)=>(<Dineincard key={hotelfood?.info.id} hotelfood={hotelfood} ></Dineincard>))
            }
            </div>
        </section>
    )
}

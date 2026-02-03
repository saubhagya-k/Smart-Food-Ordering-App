import React from 'react'

import Dineincard from "./Dineincard"
import {dineoutRestaurants} from '../../Utils/hotels'

export default function Dinein(){
    return(
        <>
        <div>
            <p className=" text-2xl font-bold relative mt-30 ml-45">Discover best restaurants on Dineout</p>
        </div>
        <div>
        <div className="flex container mx-auto   flex-nowrap overflow-x-auto mt-15 max-w-[80%]">{
            
            dineoutRestaurants.map((hotelfood)=>(<Dineincard key={hotelfood?.info.id} hotelfood={hotelfood} ></Dineincard>))

            }

            
            
            
        </div>
        </div>
        </>
    )
}
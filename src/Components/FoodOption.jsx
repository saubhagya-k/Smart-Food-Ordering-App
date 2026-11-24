import {imageGridCards} from "../../Utils/foodata"
import Foodcard from "./FoodCard"
import React from 'react'
import {imageGrid} from "../../Utils/itm"
import Mal from "./Mal"

// Phone-first: cards wrap into a grid that gains columns as the screen widens.
export default function FoodOption(){
    return(
        <>
        <div className="max-w-7xl mx-auto px-4 mt-8 md:mt-16 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">{
            imageGridCards.map((foodData)=><Foodcard key={foodData.id} foodData={foodData}></Foodcard>)
        }
        </div>

        <section className="max-w-7xl mx-auto px-4 mt-10 md:mt-16">
            <h1 className="text-xl md:text-2xl font-bold">Shop groceries on Instamart</h1>

            {/* One swipeable row on every screen size */}
            <div className="flex flex-nowrap overflow-x-auto gap-4 mt-4 md:mt-6 pb-2">{
                imageGrid.map((foodMal)=><Mal key={foodMal.id} foodMal={foodMal}></Mal>)
            }
            </div>
        </section>
        </>
    )
}

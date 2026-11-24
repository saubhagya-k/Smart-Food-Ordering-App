import {imageGridCards} from "../../Utils/foodata"
import Foodcard from "./FoodCard"
import React from 'react'
import {imageGrid} from "../../Utils/itm"
import Mal from "./Mal"

export function SectionTitle({ eyebrow, title, id }) {
    return (
        <div id={id} className="scroll-mt-20">
            {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.14em] text-paprika-700">{eyebrow}</p>}
            <h2 className="mt-1 font-display text-3xl md:text-4xl text-ink">{title}</h2>
        </div>
    )
}

// Categories grid + groceries row. Phone-first: grids gain columns as the screen widens.
export default function FoodOption(){
    return(
        <>
        <section className="max-w-7xl mx-auto px-4 mt-12 md:mt-16">
            <SectionTitle eyebrow="Browse by dish" title="What are you craving?" />
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 md:gap-4">{
                imageGridCards.map((foodData)=><Foodcard key={foodData.id} foodData={foodData}></Foodcard>)
            }
            </div>
        </section>

        <section className="grain bg-cream border-y border-line mt-14 md:mt-20 py-10 md:py-14">
            <div className="max-w-7xl mx-auto px-4">
                <SectionTitle id="groceries" eyebrow="Groceries" title="Fresh from the market" />
                {/* One swipeable row on every screen size */}
                <div className="flex flex-nowrap overflow-x-auto scrollbar-hide gap-4 mt-6 pb-2">{
                    imageGrid.map((foodMal)=><Mal key={foodMal.id} foodMal={foodMal}></Mal>)
                }
                </div>
            </div>
        </section>
        </>
    )
}

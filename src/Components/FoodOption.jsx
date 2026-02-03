import {imageGridCards} from "../../Utils/foodata"
import Foodcard from "./FoodCard"
import React from 'react'
import {imageGrid} from "../../Utils/itm"
import Mal from "./Mal"


export default function FoodOption(){
    return(

        <>

        <div className="w-[80%] container mx-auto flex  flex-wrap mt-20 gp-3">{
            imageGridCards.map((foodData)=><Foodcard key={foodData.id} foodData={foodData}></Foodcard>)
            
            }
            
            </div>

            <div>

                <h1 className="text-2xl font-bold relative mt-30 ml-45">Shop groceries on Instamart</h1>

            
            
            <div className=" w-[80%] container mx-auto flex  flex-nowrap overflow-x-auto mt-15 gp-2 ">{
            imageGrid.map((foodMal)=><Mal key={foodMal.id} foodMal={foodMal}></Mal>)
            
            }
            </div>
       
            </div>

            

        
        
        
        </>
        
        
    )
}
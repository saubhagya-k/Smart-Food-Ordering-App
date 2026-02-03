import React from 'react'

export default function Mal({foodMal}){

    return(
        <div className=" ml-10 "> 
            <a href={foodMal?.action?.link}>
                <img className="min-w-[144px] min-h-[180px] gap-150  object-cover " src={"https://media-assets.swiggy.com/swiggy/image/upload/"+ foodMal?.imageId}  />
                <p className="">{foodMal?.action?.text}</p>
            </a>
            
            
           
        </div>
    )

}
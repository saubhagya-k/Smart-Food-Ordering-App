import React from 'react'
// //border-amber-400 border-4

export default function Dineincard({hotelfood}){

    return(
        <>
       

        <div className="relative">
            <a target="blank" href={hotelfood.cta.link}>
            <img className="min-w-[326px] max-h-[189px]  mr-16" src={"https://media-assets.swiggy.com/swiggy/image/upload/"+hotelfood?.info?.mediaFiles[0]?.url}/>
            <p className="absolute bottom-3 left-4 text-2xl text-[#ffffff] font-bold z-10">{hotelfood?.info?.name}</p>
            <p className="absolute bottom-6 right-18 bg-green-600 text-[#ffffff] font-bold z-10">{hotelfood?.info?.rating?.value}</p>
            <div className="absolute bg-gradient-to-t h-12 from-black bottom-0 left-0 right-0  mr-16"></div>


            
        </a>
        
        </div>
        

        </>
    )

}
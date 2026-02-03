
import React from 'react'

import {Link} from "react-router-dom";


  //bg-gradient-to-t h-12 from-black left-0 right-0 bottom-0
  

export default function RestCard({ restInfo }) {
  return (


    <Link to={"/city/chennai/"+restInfo?.info?.id}>
    
    

    <div className="transform transition hover:scale-95  duration-100  " >
    
      
        <div className="relative overflow-hidden ">
         
            <img
      className="w-70 h-45 object-cover relative  rounded-xl  mt-10"
      src={`https://media-assets.swiggy.com/swiggy/image/upload/${restInfo.info.cloudinaryImageId}`}
      alt={restInfo?.info?.name}/>

     
       
    
    <div className=" absolute  gap-2 flex rounded-xl text-2xl font-bold text-[#ffffffeb]   border-amber-700 bg-gradient-to-t h-12 from-black left-0 right-0 bottom-0 "> 
        <p className="bottom-1.5 ml-4">{restInfo?.info?.aggregatedDiscountInfoV3?.header}</p>
      
       <p className="bottom-1.5"> {restInfo?.info?.aggregatedDiscountInfoV3?.subHeader}</p>

    </div>
   
    
        </div>
   
    <div className="  text-[18px] font-bold mt-3 truncate max-w-[200px]" >
        {restInfo?.info?.name}
    </div> 
    <div className=" flex gap-1.5 text-[16px] ">
        <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
         fill="currentColor"
         className="w-6 h-6 fill-green-500"
>
  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.538 1.118l-3.38-2.455a1 1 0 00-1.175 0l-3.38 2.455c-.783.57-1.838-.196-1.538-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.287-3.967z" />
</svg>
       <p className=""> {restInfo?.info?.avgRating}.</p>
       <p className=" font-bold "> {restInfo?.info?.sla?.slaString}</p>
    </div>
    <div className=" text-[16px]  text-[#02060c99]  flx-wrap   line-clamp-2 max-w-[200px]">
       <p> {restInfo?.info?.cuisines.join(", ")}</p>
    </div>
    </div> 

    </Link>
 
    
  );
}


import React from 'react'
import {useState} from 'react';
export default function RestInfo({restData,setCartCount,cartItems,setCartItems}){

  const [count,setCount] = useState(0);

  

  const adding=()=>{
    setCount(1);
    setCartCount(prev => prev + 1);

    setCartItems(prev => [
   ...prev,
   {
     id: restData.id,
     name: restData.name,
      qty: 1,
     description: restData.description,
     image: restData.imageId 
      ? "https://media-assets.swiggy.com/swiggy/image/upload/" + restData.imageId
      : "",

     price: ("defaultPrice" in restData
       ? restData.defaultPrice/100
       : restData.price/100)

       
   }
 ])
    



  }
  const increment=()=>{
    setCount(count+1);
    setCartCount(prev => prev + 1);
    setCartItems(prev =>
   prev.map(item =>
     item.id === restData.id
       ? {...item, qty: item.qty + 1}
       : item
   )
 )


  }

  const decrement=()=>{
    setCount(count-1);
    setCartCount(prev => prev - 1);
     setCartItems(prev =>
   prev
     .map(item =>
       item.id === restData.id
         ? {...item, qty: item.qty - 1}
         : item
     )
     .filter(item => item.qty > 0)
 )

  }




    return (
         <>
        {/* Text takes the remaining width; the picture keeps a fixed, phone-friendly size */}
        <div className="flex w-full justify-between gap-4 mb-2 pb-4">
          <div className="flex-1 min-w-0">
            <p className="text-lg md:text-2xl text-gray-700 font-semibold mb-1">{restData?.name}</p>
            <p className="text-base md:text-xl">{"₹"+ ("defaultPrice" in restData ? restData?.defaultPrice/100:restData?.price/100)}</p>
            <span className="text-green-700">{restData?.ratings?.aggregatedRating?.rating}</span>
            <span>{"("+restData?.ratings?.aggregatedRating?.ratingCountV2+")"}</span>
            <p className="text-sm md:text-base text-gray-600 line-clamp-3 md:line-clamp-none">
                {restData?.description}
            </p>
          </div>
          <div className="relative shrink-0 w-28 sm:w-36 md:w-40">
            <img className="w-full h-28 sm:h-36 object-cover rounded-2xl md:rounded-3xl bg-gray-100" alt={restData?.name || ""} src={restData.imageId ? "https://media-assets.swiggy.com/swiggy/image/upload/" + restData.imageId : ""}></img>
            {/* Centred under the picture, overlapping its bottom edge */}
            {
              (count == 0)?(<button className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-xl text-base md:text-xl font-semibold text-green-600 px-5 md:px-6 py-1.5 md:py-2 shadow-md border border-gray-100 bg-white" onClick={adding}>ADD</button>):(
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center rounded-xl text-base md:text-xl font-semibold text-green-600 px-3 md:px-4 py-1.5 md:py-2 shadow-md border border-gray-100 bg-white whitespace-nowrap">
                <button className="px-2" onClick={decrement}>-</button>
                <span className="px-1">{count}</span>
                <button className="px-2" onClick={increment}>+</button>
                </div>
              )
            }
          </div>
        </div>
        <hr className="mb-6 mt-2"></hr>
        </>

    )
}
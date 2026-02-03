
import {useState} from 'react';
export default function RestInfo({restData,setCartCount}){

  const [count,setCount] = useState(0);

  const adding=()=>{
    setCount(1);
     setCartCount(prev => prev + 1);



  }
  const increment=()=>{
    setCount(count+1);
    setCartCount(prev => prev + 1);


  }

  const decrement=()=>{
    setCount(count-1);
    setCartCount(prev => prev - 1);

  }




    return (
         <>
        <div className="flex w-full justify-between mb-2 pb-2">
          <div className="w-[70%]">
            <p className="text-2xl text-gray-700 font-semibold mb-1">{restData?.name}</p>
            <p className="text-xl">{"₹"+ ("defaultPrice" in restData ? restData?.defaultPrice/100:restData?.price/100)}</p>
            <span className="text-green-700">{restData?.ratings?.aggregatedRating?.rating}</span>
            <span>{"("+restData?.ratings?.aggregatedRating?.ratingCountV2+")"}</span>
            <p>
                {restData?.description}
            </p>    
          </div>
          <div className="w-[20%] relative">
            <img className="w-full h-36 object-cover rounded-3xl" src={"https://media-assets.swiggy.com/swiggy/image/upload/"+restData.imageId}></img>
            {
              (count == 0)?(<button className="absolute bottom-1 left-20 rounded-xl text-2xl text-green-600 px-6 py-2 shadow-md border border-white bg-white" onClick={adding}>ADD</button>):(
                <div className="absolute bottom-1 left-20 rounded-xl text-2xl text-green-600 px-6 py-2 shadow-md border border-white bg-white ">
                <button className="pr-4" onClick={decrement}>-</button>
                <span>{count}</span>
                <button className="pl-4" onClick={increment}>+</button>
                </div>

              )
            }
          </div>
        </div>
        <hr className="mb-6 mt-2"></hr>
        </>

    )
}
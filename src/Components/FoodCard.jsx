import React from 'react'



export default function Foodcard({ foodData }) {
    return (
        
      
        <div className=" ml-10"> 
            <a className=" ml-10" href={foodData?.action?.link}>
                <img className="w-[174px] h-[180px]" src={"https://media-assets.swiggy.com/swiggy/image/upload/"+ foodData?.imageId}  />
            </a>
            
            
           
        </div>

        

       
    )
}

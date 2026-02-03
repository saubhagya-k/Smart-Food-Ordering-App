import { useEffect, useState } from "react";
import { useParams } from "react-router";
import MenuCard from "./MenuCard";
import { Link } from "react-router-dom";



export default function RestaurantMenu({setCartCount} ){
   
    let {id} = useParams();
    console.log(id);

    const [RestData, setRestData] = useState([]);
    const [selected,setSelected] = useState([])

    useEffect(()=>{
    
        async function fetchData() {
           
           const proxyServer = "https://cors-anywhere.herokuapp.com/"
           const swiggyAPI = `https://www.swiggy.com/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;
           const response = await fetch(proxyServer+swiggyAPI);
           const data = await response.json();
           const tempData = data?.data?.cards[5]?.groupedCard?.cardGroupMap?.REGULAR?.cards;
           const filterData = tempData.filter((items)=> 'title' in items?.card?.card)
           setRestData(filterData);
        }
   
        fetchData();
       },[])

       console.log(RestData);

    return(
      <div className="w-[80%] container mx-auto mt-20 mb-20">
        <Link to={`/city/chennai/${id}/search`}>
          <p className="w-full text-center py-4 rounded-4xl bg-gray-200 text-2xl">Search for Dishes</p>
          </Link>
           
      

        <div className="w-[80%] container mx-auto mt-10">
        <button className={`text-2xl py-2 px-8 mr-4 border rounded-2xl ${selected==='Veg'?"bg-green-600":"bg-gray-300"}`} onClick={()=>setSelected(selected==='Veg'?null:'Veg')}>Veg</button>
        <button className={`text-2xl py-2 px-4  border rounded-2xl ${selected==='Non Veg'?'bg-red-600':'bg-gray-300'}`} onClick={()=>setSelected(selected==='Non Veg'?null:'Non Veg')}>Non Veg</button>
        
      

      </div>
        <div className="w-[80%] mx-auto mt-20">
          {
            RestData.map((menuItems)=><MenuCard key={menuItems?.card?.card?.title} menuItems={menuItems?.card?.card } foodselected={selected} setCartCount={setCartCount} ></MenuCard>)
          }
        </div>
        </div>
    )

}
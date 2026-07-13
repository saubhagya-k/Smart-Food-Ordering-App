import { useEffect, useState } from "react";
import { useParams } from "react-router";
import MenuCard from "./MenuCard";
import { Link } from "react-router-dom";

export default function RestaurantMenu({ setCartCount, cartItems, setCartItems }) {
   
    let { id } = useParams();
    console.log("Current Restaurant ID:", id);

    const [RestData, setRestData] = useState([]);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        async function fetchData() {
           // 👇 Using your local Express proxy instead of cors-anywhere
           const localProxyAPI = 
             `http://localhost:8080/api/swiggy/mapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=28.7040592&lng=77.10249019999999&restaurantId=${id}`;

           try {
             const response = await fetch(localProxyAPI);
             const data = await response.json();
             
             // Safely extract the menu card streams using optional chaining
             const tempData = data?.data?.cards[5]?.groupedCard?.cardGroupMap?.REGULAR?.cards || [];
             const filterData = tempData.filter((items) => 'title' in items?.card?.card);
             
             setRestData(filterData);
           } catch (err) {
             console.error("Error fetching menu data:", err);
           }
        }
   
        fetchData();
    }, [id]); //  CRUCIAL FIX: Added 'id' here so it re-fetches when switching restaurants

    console.log("Filtered Menu Data:", RestData);

    return (
      <div className="w-[80%] container mx-auto mt-20 mb-20">
        <Link to={`/city/chennai/${id}/search`}>
          <p className="w-full text-center py-4 rounded-4xl bg-gray-200 text-2xl">Search for Dishes</p>
        </Link>
           
        <div className="w-[80%] container mx-auto mt-10">
          <button 
            className={`text-2xl py-2 px-8 mr-4 border rounded-2xl ${selected === 'Veg' ? "bg-green-600 text-white" : "bg-gray-300"}`} 
            onClick={() => setSelected(selected === 'Veg' ? null : 'Veg')}
          >
            Veg
          </button>
          <button 
            className={`text-2xl py-2 px-4 border rounded-2xl ${selected === 'Non Veg' ? "bg-red-600 text-white" : "bg-gray-300"}`} 
            onClick={() => setSelected(selected === 'Non Veg' ? null : 'Non Veg')}
          >
            Non Veg
          </button>
        </div>

        <div className="w-[80%] mx-auto mt-20">
          {RestData.map((menuItems) => (
            <MenuCard 
              key={menuItems?.card?.card?.title} 
              menuItems={menuItems?.card?.card} 
              foodselected={selected} 
              setCartCount={setCartCount}  
              cartItems={cartItems} 
              setCartItems={setCartItems} 
            />
          ))}
        </div>
      </div>
    );
}

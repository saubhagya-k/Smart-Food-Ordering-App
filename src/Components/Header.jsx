
import {Link } from 'react-router-dom'
import React, { useState } from 'react';

function Header({user, setUser, setShowLogin}) {

  const [showDropdown, setShowDropdown] = useState(false);
  

  return (
    <div>
      
        <header className="bg-[#ff5200] font-serif">
           <div className=" text-base flex  justify-between container mx-auto py-8"> 
            <img className=" h-12 w-40  m-3" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/static-assets/images/swiggy_logo_white.png"/>
            <div className=" flex gap-10 my-3 items-center">
              <a target="_bank" href="https://www.swiggy.com/corporate/" className="text-[#ffffff]  ">Swiggy Corporate</a>
              <a target="_bank" href="https://partner.swiggy.com/login#/swiggy" className="text-[#ffffff]   ">Partnear with us</a>
              <a target="_bank" href="https://www.swiggy.com/corporate/" className="text-[#ffffff] border-1 border-white rounded-2xl p-3 ">Get The App</a>

                      <div className="flex gap-6 items-center relative">
  {user ? (
    <div className="relative">
      {/* Profile Button */}
      <button
        className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2"
        onClick={() => setShowDropdown((prev) => !prev)}
      >
        {user.email}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-60 bg-white text-black rounded-xl shadow-xl border z-50">
          
          {/* User Info */}
          <div className="px-4 py-3 border-b">
            <p className="text-sm font-semibold">{user.username}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          
          <Link
            to="/profile"
            className="block px-4 py-2 hover:bg-gray-100 text-sm "
            onClick={() => setShowDropdown(false)}
          >
            Profile
          </Link>

          {/* Logout */}
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm hover:rounded-3xl"
            onClick={() => {
              fetch("http://localhost:8080/logout", {
                credentials: "include",
              });
              setUser(null);
              setShowDropdown(false);
              setShowLogin(true);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      className="bg-black text-white px-6 py-2 rounded-xl"
      onClick={() => setShowLogin(true)}
    >
      Sign In
    </button>
  )}
</div>


              
            </div>
           </div>


           <div className="pt-16 pb-8 relative">
            <img className="h-113 w-63 absolute top-0 left-0" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Veggies_new.png"/>
            <img className="h-113 w-63 absolute top-0 right-0" src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/portal/testing/seo-home/Sushi_replace.png"/>
            <div className="max-w-[55%] text-[#ffffff] text-5xl p-2  font-bold container mx-auto text-center ">
              <p>Order food & groceries. Discover best restaurants. Swiggy it!</p>
            </div>


            <div className="container mx-auto  max-w-[70%]  text-xl  flex gap-10 m-8 ml-110">
              <input className="  bg-[#ffffff] rounded-2xl p-4 w-[300px]"placeholder='Enter you Delivery Location'></input>
              <input className="  bg-[#ffffff] rounded-2xl p-4 w-[525px]"placeholder='Search for restaurents,items,or more'></input>
            </div>
           </div>

           <div className="flex w-7xl   container mx-auto">
            <div>
              <Link to='/restaurent'>
              <img  src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/ec86a309-9b06-48e2-9adc-35753f06bc0a_Food3BU.png"/>
              </Link>
            </div>
            <div>
              <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b5c57bbf-df54-4dad-95d1-62e3a7a8424d_IM3BU.png"/>
            </div>
            <div>

              <img src="https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b6d9b7ab-91c7-4f72-9bf2-fcd4ceec3537_DO3BU.png"/>
            </div>

            

    
             







           </div>


           

        </header>

    </div>
    
  )
}

export default Header;

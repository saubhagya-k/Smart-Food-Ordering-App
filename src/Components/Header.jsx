
import {Link } from 'react-router-dom'
import React, { useState } from 'react';
import { API_URL } from './../../Utils/api';

const IMG = "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/";

// Phone-first: base classes are for phones, md:/lg: add the desktop layout.
function Header({user, setUser, setShowLogin}) {

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div>
        <header className="bg-[#dc2626] font-serif overflow-hidden">
           <div className="text-base flex items-center justify-between max-w-7xl mx-auto px-4 py-4 md:py-8">
            <h1 className="text-white text-xl font-bold">EAT STACK</h1>
            <div className="flex gap-4 lg:gap-10 items-center">
              {/* Extra links only where there is room */}
              <a target="_blank" rel="noreferrer" href="https://www.swiggy.com/corporate/" className="hidden lg:inline text-white">Eat Stack Corporate</a>
              <a target="_blank" rel="noreferrer" href="https://partner.swiggy.com/login#/swiggy" className="hidden lg:inline text-white">Partner with us</a>
              <a target="_blank" rel="noreferrer" href="https://www.swiggy.com/corporate/" className="hidden md:inline text-white border border-white rounded-2xl px-3 py-2">Get The App</a>

              <div className="flex gap-6 items-center relative">
  {user ? (
    <div className="relative">
      {/* Profile Button */}
      <button
        className="bg-black text-white px-4 py-2 rounded-xl flex items-center gap-2 max-w-[60vw] truncate"
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
              fetch(`${API_URL}/logout`, {
                method: "POST",
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
      className="bg-black text-white px-5 py-2 rounded-xl whitespace-nowrap"
      onClick={() => setShowLogin(true)}
    >
      Sign In
    </button>
  )}
</div>
            </div>
           </div>


           <div className="relative pt-6 pb-8 md:pt-16">
            {/* Side food pictures are decoration: only on wide screens, where they don't cover the text */}
            <img alt="" className="hidden xl:block h-[452px] w-[252px] absolute top-0 left-0" src={IMG + "portal/testing/seo-home/Veggies_new.png"}/>
            <img alt="" className="hidden xl:block h-[452px] w-[252px] absolute top-0 right-0" src={IMG + "portal/testing/seo-home/Sushi_replace.png"}/>

            <div className="relative max-w-3xl mx-auto px-4 text-white text-3xl sm:text-4xl md:text-5xl font-bold text-center leading-tight">
              <p>Order food & groceries. Discover best restaurants. Swiggy it!</p>
            </div>

            {/* Stacked on phones, side by side from tablet up */}
            <div className="relative max-w-3xl mx-auto px-4 mt-6 md:mt-8 flex flex-col md:flex-row gap-3 md:gap-6 text-base md:text-xl">
              <input className="bg-white rounded-2xl p-3 md:p-4 w-full md:w-2/5" placeholder='Enter your delivery location'></input>
              <input className="bg-white rounded-2xl p-3 md:p-4 w-full md:flex-1" placeholder='Search for restaurants, items or more'></input>
            </div>
           </div>

           {/* Phones: swipeable row (each banner ~3/4 of the screen). Tablet up: 3 columns */}
           <div className="max-w-6xl mx-auto px-4 pb-6 flex overflow-x-auto snap-x snap-mandatory gap-3 sm:grid sm:grid-cols-3 sm:overflow-visible">
            <Link to='/restaurent' className="block shrink-0 w-3/4 snap-start sm:w-auto">
              <img alt="Food delivery" className="w-full h-auto" src={IMG + "MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/ec86a309-9b06-48e2-9adc-35753f06bc0a_Food3BU.png"}/>
            </Link>
            <img alt="Instamart" className="shrink-0 w-3/4 snap-start sm:w-auto h-auto" src={IMG + "MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b5c57bbf-df54-4dad-95d1-62e3a7a8424d_IM3BU.png"}/>
            <img alt="Dineout" className="shrink-0 w-3/4 snap-start sm:w-auto h-auto" src={IMG + "MERCHANDISING_BANNERS/IMAGES/MERCH/2024/7/23/b6d9b7ab-91c7-4f72-9bf2-fcd4ceec3537_DO3BU.png"}/>
           </div>

        </header>

    </div>

  )
}

export default Header;

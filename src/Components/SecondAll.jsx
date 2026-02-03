import React from 'react'

import { FiSearch, FiHelpCircle, FiUser, FiShoppingCart } from "react-icons/fi";


const SecondAll = ({cartCount}) => {
  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left Section */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              S
            </div>
            <span className="font-semibold text-lg">Other</span>
            <span className="text-orange-500">▼</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-8 text-gray-700 font-medium">

          <div className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
            <span>Swiggy Corporate</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
            <FiSearch size={18} />
            <span>Search</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
            <span className="relative">
              Offers
              <span className="absolute -top-2 -right-6 text-xs text-orange-500 font-semibold">
                NEW
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
            <FiHelpCircle size={18} />
            <span>Help</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
            <FiUser size={18} />
            <span>Sign In</span>
          </div>

          <div className="flex items-center gap-2 cursor-pointer hover:text-orange-500">
            <FiShoppingCart size={18} />
            <span>Cart</span>
            <span className="ml-1 bg-gray-200 px-2 py-0.5 rounded-full text-sm">
              {cartCount}
            </span>
          </div>

        </div>
      </div>
    </nav>
  )
}

export default SecondAll

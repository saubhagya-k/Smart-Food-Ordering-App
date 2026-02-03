import React from 'react'
import {
  FiArrowLeft,
  FiHelpCircle,
  FiMoreVertical,
  FiFileText,
  FiHeart,
  FiBookmark,
} from "react-icons/fi";
import { MdTrain, MdWork, MdSchool, MdStore } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";


const User_Details = () => {
      const menuItems = [
    { icon: <RiCoupon3Line />, label: "My Vouchers" },
    { icon: <FiFileText />, label: "Account Statements" },
    { icon: <MdTrain />, label: "Order Food on Train" },
    { icon: <MdWork />, label: "Corporate Rewards" },
    { icon: <MdSchool />, label: "Student Rewards" },
    { icon: <MdStore />, label: "My Instamart Wishlist" },
    { icon: <FiHeart />, label: "Favourites" },
    { icon: <FiBookmark />, label: "Partner Rewards" },
    { icon: <IoWarningOutline />, label: "Allow restaurants to contact you" },
  ];


  return (
    <div className="bg-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <FiArrowLeft size={22} />
        <h1 className="text-lg font-semibold tracking-wide">MY ACCOUNT</h1>
        <div className="flex items-center gap-4">
          <button className="bg-orange-50 text-orange-500 px-3 py-1 rounded-full text-sm font-medium">
            Help
          </button>
          <FiMoreVertical size={20} />
        </div>
      </div>

      {/* Menu Card */}
      <div className="mx-4 mt-4 border rounded-2xl overflow-hidden">
        {menuItems.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between px-4 py-4 border-b last:border-none"
          >
            <div className="flex items-center gap-4 text-gray-700">
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
            <span className="text-gray-400 text-lg">›</span>
          </div>
        ))}
      </div>

      {/* Past Orders */}
      <div className="px-4 mt-6">
        <h2 className="text-xs tracking-widest text-gray-500 mb-3">
          PAST ORDERS
        </h2>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 text-sm font-medium mb-5">
          {["Food", "Instamart", "Dineout", "Giftables"].map((tab, i) => (
            <button
              key={i}
              className={`flex-1 py-2 rounded-full ${
                i === 0 ? "bg-black text-white" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Error Card */}
        <div className="border rounded-2xl p-4">
          <div className="flex items-start gap-2 text-red-500 mb-2">
            <IoWarningOutline size={18} />
            <p className="font-semibold text-sm">
              Oops! Something went wrong
            </p>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            We are unable to retrieve your food orders at the moment. Please
            try after a few minutes.
          </p>
          <button className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold">
            Reload Again
          </button>
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 mt-10">
        App version 4.100.0 (159)
      </p>
    </div>
  );

  
}

export default User_Details

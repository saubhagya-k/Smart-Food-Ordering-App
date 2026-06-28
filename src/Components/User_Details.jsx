import React, { useState } from 'react';
import {
  FiArrowLeft,
  FiHelpCircle,
  FiMoreVertical,
  FiFileText,
  FiHeart,
  FiBookmark,
  FiStar,
  FiClock,
  FiMapPin,
  FiCreditCard,
  FiBell,
  FiLogOut,
} from "react-icons/fi";
import { MdTrain, MdWork, MdSchool, MdStore, MdLocalOffer, MdHistory } from "react-icons/md";
import { RiCoupon3Line } from "react-icons/ri";
import { IoWarningOutline, IoSettingsOutline } from "react-icons/io5";
import { GiKnifeFork } from "react-icons/gi";
import { useNavigate } from 'react-router-dom';

const User_Details = ({ user, setUser, setShowLogin }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Food");

  const menuItems = [
    { icon: <RiCoupon3Line />, label: "My Vouchers", color: "text-purple-500", bg: "bg-purple-50" },
    { icon: <FiFileText />, label: "Account Statements", color: "text-blue-500", bg: "bg-blue-50" },
    { icon: <MdTrain />, label: "Order Food on Train", color: "text-red-500", bg: "bg-red-50" },
    { icon: <MdWork />, label: "Corporate Rewards", color: "text-orange-500", bg: "bg-orange-50" },
    { icon: <MdSchool />, label: "Student Rewards", color: "text-green-500", bg: "bg-green-50" },
    { icon: <MdStore />, label: "My Instamart Wishlist", color: "text-pink-500", bg: "bg-pink-50" },
    { icon: <FiHeart />, label: "Favourites", color: "text-red-500", bg: "bg-red-50" },
    { icon: <FiBookmark />, label: "Partner Rewards", color: "text-indigo-500", bg: "bg-indigo-50" },
  ];

  const quickActions = [
    { icon: <FiMapPin />, label: "Saved Addresses", count: "3" },
    { icon: <FiCreditCard />, label: "Payment Methods", count: "2" },
    { icon: <FiBell />, label: "Notifications", count: "5" },
    { icon: <IoSettingsOutline />, label: "Settings", count: "" },
  ];

  const pastOrders = [
    { id: "#ORD001", restaurant: "Bombay Brasserie", date: "Apr 15, 2026", total: "₹450", status: "Delivered", rating: 4 },
    { id: "#ORD002", restaurant: "Masala Tadka", date: "Apr 12, 2026", total: "₹780", status: "Delivered", rating: 5 },
    { id: "#ORD003", restaurant: "FB Cakes", date: "Apr 8, 2026", total: "₹350", status: "Delivered", rating: 4 },
    { id: "#ORD004", restaurant: "Punjab Grill", date: "Apr 5, 2026", total: "₹1200", status: "Delivered", rating: 5 },
  ];

  const handleLogout = () => {
    setUser(null);
    setShowLogin(true);
    navigate('/');
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen font-sans">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="flex items-center justify-between px-5 py-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <FiArrowLeft size={22} className="text-gray-700" />
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            My Account
          </h1>
          <div className="flex items-center gap-2">
            <button className="bg-orange-50 text-orange-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors">
              <FiHelpCircle className="inline mr-1" size={14} />
              Help
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <FiMoreVertical size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-5 py-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-3 text-white shadow-lg">
            <GiKnifeFork size={24} className="mb-1 opacity-80" />
            <p className="text-lg font-bold">12</p>
            <p className="text-xs opacity-90">Orders</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md">
            <RiCoupon3Line size={24} className="text-purple-500 mb-1" />
            <p className="text-lg font-bold text-gray-800">3</p>
            <p className="text-xs text-gray-500">Vouchers</p>
          </div>
          <div className="bg-white rounded-xl p-3 shadow-md">
            <FiStar size={24} className="text-yellow-500 mb-1" />
            <p className="text-lg font-bold text-gray-800">4.8</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2">
          {quickActions.map((action, i) => (
            <button key={i} className="bg-white rounded-xl p-3 text-center shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl text-orange-500 mb-1 mx-auto">{action.icon}</div>
              <p className="text-xs font-medium text-gray-700">{action.label}</p>
              {action.count && <span className="text-[10px] text-gray-400">{action.count} saved</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="px-5 mb-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Rewards & Benefits</h3>
        <div className="grid grid-cols-2 gap-3">
          {menuItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`${item.bg} ${item.color} p-2 rounded-lg group-hover:scale-105 transition-transform`}>
                <span className="text-xl">{item.icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 flex-1">{item.label}</span>
              <span className="text-gray-300 text-lg">›</span>
            </div>
          ))}
        </div>
      </div>

      {/* Past Orders Section */}
      <div className="px-5 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            PAST ORDERS
          </h2>
          <button className="text-orange-500 text-xs font-medium">View All</button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-full p-1 shadow-sm mb-5">
          {["Food", "Instamart", "Dineout", "Giftables"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {activeTab === "Food" && pastOrders.map((order, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-800">{order.restaurant}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <FiClock size={10} /> {order.date} • {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-800">{order.total}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, s) => (
                      <FiStar key={s} size={10} className={s < order.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
                <span className="text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                  ✓ {order.status}
                </span>
                <button className="text-orange-500 text-xs font-medium hover:underline">
                  Rate & Review
                </button>
              </div>
            </div>
          ))}

          {activeTab !== "Food" && (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-4xl mb-2">🍔</div>
              <p className="text-gray-500 text-sm">No {activeTab} orders yet</p>
              <button className="mt-3 text-orange-500 text-sm font-medium">Explore {activeTab}</button>
            </div>
          )}
        </div>
      </div>

      {/* Logout Button */}
      <div className="px-5 mb-8">
        <button 
          onClick={handleLogout}
          className="w-full bg-white border border-red-200 text-red-500 py-3 rounded-xl font-semibold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
        >
          <FiLogOut size={18} />
          Logout
        </button>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-400 pb-6">
        App version 4.100.0 (159)
      </p>
    </div>
  );
};

export default User_Details;
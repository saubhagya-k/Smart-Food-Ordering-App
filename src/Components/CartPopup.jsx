import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function CartPopup({ cartItems }) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);

  const totalItems = cartItems.reduce((total, item) => {
    return total + item.qty;
  }, 0);

  // Hide popup on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setIsVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollPos]);

  if (cartItems.length === 0) return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 flex justify-center z-[9999] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Popup Card */}
        <div className="bg-white border border-gray-200 rounded-t-2xl shadow-2xl overflow-hidden">
          {/* Progress Bar - Shows cart value progress */}
          <div className="h-1.5 bg-gray-100 w-full">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
              style={{ width: `${Math.min((totalPrice / 1000) * 100, 100)}%` }}
            />
          </div>

          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              
              {/* Left Section - Cart Summary */}
              <div className="flex items-center gap-4 flex-1">
                {/* Shopping Bag Icon with Badge */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-50 to-green-100 rounded-xl flex items-center justify-center">
                    <svg 
                      className="w-6 h-6 text-green-600" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                      />
                    </svg>
                  </div>
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-[22px] text-center shadow-lg">
                    {totalItems}
                  </span>
                </div>

                {/* Cart Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-gray-900">
                      Cart Summary
                    </h3>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {totalItems} {totalItems === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{totalPrice.toLocaleString('en-IN')}
                    </p>
                    
                    {/* Price Breakdown - Optional */}
                    {totalItems > 1 && (
                      <p className="text-xs text-gray-500">
                        (Avg. ₹{Math.round(totalPrice / totalItems).toLocaleString('en-IN')}/item)
                      </p>
                    )}
                  </div>

                  {/* Quick Stats */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Estimated delivery in 3-5 days
                    </span>
                    
                    {totalPrice > 500 && (
                      <span className="flex items-center gap-1 text-green-600">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Free shipping eligible
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Section - Actions */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* View Cart Button */}
                <button
                  onClick={() => navigate("/cart")}
                  className="flex-1 sm:flex-none px-5 py-2.5 border-2 border-green-600 text-green-600 rounded-xl font-semibold text-sm hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-2 group"
                >
                  <svg 
                    className="w-4 h-4 transition-transform group-hover:-translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  View Cart
                </button>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:from-green-700 hover:to-green-800 transform transition-all duration-200 hover:scale-[1.02] focus:ring-4 focus:ring-green-200 focus:outline-none shadow-lg flex items-center justify-center gap-2 group"
                >
                  Checkout
                  <svg 
                    className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                {/* Close Button (Optional) */}
                <button 
                  onClick={() => setIsVisible(false)}
                  className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Additional Info for Mobile */}
            <div className="mt-3 pt-3 border-t border-gray-100 sm:hidden">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">You're saving</span>
                <span className="text-green-600 font-semibold">
                  ₹{Math.round(totalPrice * 0.1).toLocaleString('en-IN')} (10%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
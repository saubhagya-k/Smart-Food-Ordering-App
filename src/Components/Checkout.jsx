import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Checkout({ cartItems }) {
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.price * item.qty;
  }, 0);

  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);

  const deliveryCharge = totalPrice > 500 ? 0 : 40;
  const grandTotal = totalPrice + deliveryCharge;

  const navigate = useNavigate();

  // Function to call FastAPI for nutrition analysis
  const analyzeMeal = async () => {
    if (cartItems.length === 0) {
      setMessage("❌ Your cart is empty!");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const description = cartItems
        .map(item => `${item.qty} ${item.name}`)
        .join(" and ");
      
      console.log("Sending to FastAPI:", description);
      
      const response = await fetch("http://localhost:8000/analyze-meal", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: description,
          user_id: "anonymous"
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log("Nutrition analysis:", result);
        
        if (result.success) {
          setNutritionData(result.data);
          setMessage(`✅ Meal Analysis: ${result.data.meal_summary.total_calories} calories (${result.data.meal_summary.daily_percentage}% of daily goal)`);
          
          alert(`Nutrition Summary:\n\n` +
            `Calories: ${result.data.meal_summary.total_calories} kcal\n` +
            `Protein: ${result.data.meal_summary.total_protein_g}g\n` +
            `Carbs: ${result.data.meal_summary.total_carbs_g}g\n` +
            `Fat: ${result.data.meal_summary.total_fat_g}g\n\n` +
            `💡 ${result.data.insights.join("\n💡 ")}`
          );
        } else {
          setMessage(`❌ Analysis failed: ${result.message}`);
        }
      } else {
        setMessage("❌ Failed to connect to nutrition service");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("❌ Error connecting to nutrition service. Make sure FastAPI is running on port 8000");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to proceed to payment
  const goToPayment = () => {
    if (cartItems.length === 0) {
      setMessage("❌ Your cart is empty!");
      return;
    }
    
    navigate('/payment', {
      state: {
        cartItems: cartItems,
        grandTotal: grandTotal
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 sm:px-6 lg:px-8">
      {/* Header with breadcrumb */}
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>Cart</span>
          <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-gray-900 font-medium">Checkout</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Complete your order</h1>
        <p className="text-gray-500 mt-1">Review your items and confirm payment</p>
      </div>

      {/* Display message if any */}
      {message && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
          {message}
        </div>
      )}

      {/* Display nutrition summary if available */}
      {nutritionData && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-semibold text-green-800 mb-2">Nutrition Summary</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="text-green-700">Calories:</span>
            <span className="font-medium">{nutritionData.meal_summary.total_calories} kcal</span>
            <span className="text-green-700">Protein:</span>
            <span className="font-medium">{nutritionData.meal_summary.total_protein_g}g</span>
            <span className="text-green-700">Carbs:</span>
            <span className="font-medium">{nutritionData.meal_summary.total_carbs_g}g</span>
            <span className="text-green-700">Fat:</span>
            <span className="font-medium">{nutritionData.meal_summary.total_fat_g}g</span>
          </div>
          <div className="mt-2 text-xs text-green-600">
            {nutritionData.insights.map((insight, i) => (
              <div key={i}>💡 {insight}</div>
            ))}
          </div>
        </div>
      )}

      <div className="lg:grid lg:grid-cols-3 lg:gap-8">
        {/* Main content - Order items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Items header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Order Items ({cartItems.length})</h2>
            </div>

            {/* Items list */}
            <div className="divide-y divide-gray-200">
              {cartItems.length === 0 ? (
                <div className="px-6 py-12 text-center text-gray-500">
                  Your cart is empty. Add some items to checkout.
                </div>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Unit Price: ₹{item.price}
                        </p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <span className="ml-2 px-2 py-1 bg-gray-100 rounded-md text-sm font-medium">
                            {item.qty}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{item.price * item.qty}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          ₹{item.price} × {item.qty}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Delivery info */}
          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-900">Delivery Information</h4>
                <p className="text-sm text-blue-700 mt-1">
                  {deliveryCharge === 0 
                    ? "🎉 Free delivery on orders above ₹500" 
                    : "Standard delivery: ₹40 (Free on orders above ₹500)"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Order summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Details</h2>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">₹{totalPrice}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Charge</span>
                <span className={deliveryCharge === 0 ? "text-green-600 font-medium" : "font-medium text-gray-900"}>
                  {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                </span>
              </div>
              
              {deliveryCharge > 0 && totalPrice < 500 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  Add ₹{500 - totalPrice} more for free delivery
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-base font-semibold text-gray-900">Total Amount</span>
                  <span className="text-xl font-bold text-gray-900">₹{grandTotal}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
              </div>
            </div>

            {/* Nutrition Analysis Button */}
            <button
              onClick={analyzeMeal}
              disabled={isLoading || cartItems.length === 0}
              className={`w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transform transition-all duration-200 hover:scale-[1.02] focus:ring-4 focus:ring-blue-200 focus:outline-none shadow-lg ${
                isLoading || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Analyzing Nutrition...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>🔬 Analyze Meal Nutrition</span>
                  </>
                )}
              </div>
            </button>

            {/* Payment Button */}
            <button
              onClick={goToPayment}
              disabled={cartItems.length === 0}
              className={`w-full mt-4 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-semibold transform transition-all duration-200 hover:scale-[1.02] focus:ring-4 focus:ring-green-200 focus:outline-none shadow-lg ${
                cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-700 hover:to-green-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Proceed to Pay ₹{grandTotal}</span>
              </div>
            </button>

            {/* Secure payment note */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Secure SSL Encrypted Payment</span>
            </div>

            {/* Payment methods icons */}
            <div className="mt-3 flex justify-center gap-2">
              <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Visa</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">Mastercard</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">UPI</span>
              <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">NetBanking</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
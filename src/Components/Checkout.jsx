import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiLock, FiInfo } from 'react-icons/fi';
import { PiChartPieSliceBold } from 'react-icons/pi';

const FASTAPI_URL = process.env.REACT_APP_FASTAPI_URL || 'http://localhost:8000';
const FREE_DELIVERY_FROM = 500;

function Macro({ label, value, unit, tone }) {
  return (
    <div className="rounded-2xl bg-white border border-line p-3 text-center">
      <p className={`text-xl font-extrabold ${tone}`}>{value}<span className="text-sm font-semibold text-stone-warm"> {unit}</span></p>
      <p className="text-xs text-stone-warm mt-0.5">{label}</p>
    </div>
  );
}

export default function Checkout({ cartItems }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nutritionData, setNutritionData] = useState(null);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const deliveryCharge = totalPrice > FREE_DELIVERY_FROM ? 0 : 40;
  const grandTotal = totalPrice + deliveryCharge;
  const restaurants = [...new Set(cartItems.map((i) => i.restaurantName).filter(Boolean))];

  // Ask the FastAPI service for a nutrition estimate of the cart
  const analyzeMeal = async () => {
    if (cartItems.length === 0) return;
    setIsLoading(true);
    setMessage("");

    try {
      const description = cartItems.map(item => `${item.qty} ${item.name}`).join(" and ");
      const response = await fetch(`${FASTAPI_URL}/analyze-meal`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, user_id: "anonymous" })
      });

      if (!response.ok) {
        setMessage("The nutrition service didn't respond. Please try again.");
        return;
      }
      const result = await response.json();
      if (result.success) {
        setNutritionData(result.data);
      } else {
        setMessage(result.message || "Couldn't analyse this meal.");
      }
    } catch (error) {
      console.warn("Error:", error);
      setMessage("Can't reach the nutrition service right now. It may be waking up; try again in a minute.");
    } finally {
      setIsLoading(false);
    }
  };

  const goToPayment = () => {
    if (cartItems.length === 0) return;
    navigate('/payment', {
      state: {
        cartItems,
        subtotal: totalPrice,
        deliveryCharge,
        grandTotal,
        calories: nutritionData?.meal_summary?.total_calories ?? null,
      }
    });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-ink">Your cart is empty</h1>
        <p className="mt-2 text-stone-warm">Pick a restaurant and add a few dishes to get started.</p>
        <Link to="/restaurent" className="inline-flex items-center gap-2 mt-6 bg-paprika-600 hover:bg-paprika-700 text-white font-semibold rounded-full px-6 py-3">
          Browse restaurants <FiArrowRight />
        </Link>
      </div>
    );
  }

  const summary = nutritionData?.meal_summary;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-paprika-700">Checkout</p>
      <h1 className="mt-1 font-display text-3xl md:text-5xl text-ink">Review your order</h1>
      {restaurants.length > 0 && <p className="mt-1 text-stone-warm">From {restaurants.join(", ")}</p>}

      <div className="mt-8 grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <section className="bg-white rounded-3xl border border-line">
            <h2 className="px-5 md:px-6 py-4 border-b border-line font-bold text-ink">
              Items ({cartItems.reduce((n, i) => n + i.qty, 0)})
            </h2>
            <ul className="divide-y divide-line">
              {cartItems.map((item) => (
                <li key={item.id} className="px-5 md:px-6 py-4 flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-16 h-16 md:w-20 md:h-20 rounded-2xl object-cover bg-cream shrink-0" />
                  ) : (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-cream border border-line shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink truncate">{item.name}</p>
                    <p className="text-sm text-stone-warm">₹{item.price} × {item.qty}</p>
                  </div>
                  <p className="font-bold text-ink">₹{item.price * item.qty}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Nutrition estimate */}
          <section className="grain bg-cream rounded-3xl border border-line p-5 md:p-6">
            <div className="flex items-start gap-3">
              <PiChartPieSliceBold size={26} className="text-basil-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h2 className="font-bold text-ink">Nutrition estimate</h2>
                <p className="text-sm text-stone-warm">AI reads your cart and estimates a typical serving of each dish.</p>
              </div>
            </div>

            {!summary && (
              <button
                onClick={analyzeMeal}
                disabled={isLoading}
                className="mt-4 inline-flex items-center gap-2 bg-basil-600 hover:bg-basil-700 disabled:opacity-60 text-white font-semibold rounded-full px-5 py-2.5 text-sm"
              >
                {isLoading ? "Analysing your meal…" : "Estimate nutrition"}
              </button>
            )}
            {message && <p className="mt-3 text-sm text-paprika-700">{message}</p>}

            {summary && (
              <div className="mt-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Macro label={`Calories · ${summary.daily_percentage}% of a day`} value={Math.round(summary.total_calories)} unit="kcal" tone="text-paprika-700" />
                  <Macro label="Protein" value={summary.total_protein_g} unit="g" tone="text-basil-700" />
                  <Macro label="Carbs" value={summary.total_carbs_g} unit="g" tone="text-ink" />
                  <Macro label="Fat" value={summary.total_fat_g} unit="g" tone="text-ink" />
                </div>
                <ul className="mt-4 space-y-1 text-sm text-ink">
                  {nutritionData.items.map((item, i) => (
                    <li key={i}>
                      <span className="font-semibold">{item.quantity} × {item.food}</span>
                      {item.matched_as && (
                        <span className="text-stone-warm"> — estimated as {item.matched_as}{item.weight_g ? `, ~${item.weight_g} g` : ""}</span>
                      )}
                      <span>: {Math.round(item.calories)} kcal</span>
                      {item.confidence === "low" && <span className="ml-1 text-paprika-700">(rough match)</span>}
                    </li>
                  ))}
                  {nutritionData.not_found?.length > 0 && (
                    <li className="text-paprika-700">Not found, so not counted: {nutritionData.not_found.join(", ")}</li>
                  )}
                </ul>
                {nutritionData.insights?.length > 0 && (
                  <p className="mt-3 text-sm text-basil-700">
                    {/* drop the leading emoji the service adds to each tip */}
                    {nutritionData.insights.map((tip) => tip.replace(/^[^\p{L}\p{N}]+/u, "")).join(" · ")}
                  </p>
                )}
                <p className="mt-3 flex items-center gap-1.5 text-xs text-stone-warm">
                  <FiInfo /> Estimates for a typical serving. Restaurant portions and recipes vary.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Bill */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-line p-5 md:p-6 lg:sticky lg:top-24">
            <h2 className="font-bold text-ink">Bill details</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-stone-warm">Item total</dt><dd className="font-semibold">₹{totalPrice}</dd></div>
              <div className="flex justify-between">
                <dt className="text-stone-warm">Delivery</dt>
                <dd className={deliveryCharge === 0 ? "font-semibold text-basil-700" : "font-semibold"}>{deliveryCharge === 0 ? "Free" : `₹${deliveryCharge}`}</dd>
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-stone-warm bg-cream rounded-xl px-3 py-2">Add ₹{FREE_DELIVERY_FROM + 1 - totalPrice} more for free delivery</p>
              )}
              <div className="flex justify-between border-t border-line pt-3 mt-3 text-base">
                <dt className="font-bold">To pay</dt><dd className="font-extrabold">₹{grandTotal}</dd>
              </div>
            </dl>

            <button
              onClick={goToPayment}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-paprika-600 hover:bg-paprika-700 text-white font-semibold rounded-2xl py-3.5"
            >
              Continue to payment <FiArrowRight />
            </button>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-warm">
              <FiLock /> Demo checkout, no real payment is taken
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

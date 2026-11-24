import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCheck, FiArrowRight } from 'react-icons/fi';
import Review from './Review';

const OrderSuccess = () => {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-ink">No recent order</h1>
        <Link to="/profile" className="inline-block mt-6 text-paprika-700 font-semibold">See your order history →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 md:py-16">
      <div className="bg-white rounded-3xl border border-line overflow-hidden">
        <div className="grain bg-cream border-b border-line px-6 py-8 text-center">
          <span className="mx-auto w-14 h-14 rounded-full bg-basil-600 text-white flex items-center justify-center">
            <FiCheck size={28} />
          </span>
          <h1 className="mt-4 font-display text-3xl md:text-4xl text-ink">Order placed</h1>
          <p className="mt-1 text-stone-warm">
            {order.restaurants?.length ? `${order.restaurants.join(", ")} is preparing your food.` : "Your food is being prepared."}
          </p>
          <p className="mt-2 text-xs font-semibold tracking-wide text-stone-warm">ORDER {order.id}</p>
        </div>

        <div className="px-6 py-5">
          <ul className="space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-3">
                <span><span className="font-semibold">{item.qty} ×</span> {item.name}</span>
                <span className="font-semibold">₹{item.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 pt-4 border-t border-line flex justify-between font-bold">
            <span>Paid</span><span>₹{order.total}</span>
          </div>

          <p className="mt-4 text-sm text-stone-warm">
            {state?.saved
              ? "Saved to your order history on this device."
              : "We couldn't save this order to your history on this browser."}
          </p>
          <Link to="/profile" className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-paprika-700 hover:text-paprika-800">
            View order history <FiArrowRight />
          </Link>
        </div>

        <div className="px-6 pb-6">
          <Review />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;

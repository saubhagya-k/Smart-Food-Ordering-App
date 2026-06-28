import React from 'react';
import { useLocation } from 'react-router-dom';
import Review from './Review';

const OrderSuccess = () => {
  const location = useLocation();
  const { cartItems, grandTotal, orderId } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
        <p className="text-gray-600 mb-2">Thank you for your order</p>
        <p className="text-sm text-gray-400 mb-6">Order ID: {orderId}</p>
        
        <div className="border-t pt-6 mt-4">
          <Review />
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
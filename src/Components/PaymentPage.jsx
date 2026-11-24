import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiCreditCard, FiSmartphone, FiHome, FiLock, FiAlertCircle } from 'react-icons/fi';
import { saveOrder, ownerKey, newOrderId } from '../../Utils/orderHistory';

const METHODS = [
  { id: 'card', label: 'Card', icon: FiCreditCard },
  { id: 'upi', label: 'UPI', icon: FiSmartphone },
  { id: 'netbanking', label: 'Net banking', icon: FiHome },
];

const inputClass = "w-full px-4 py-3 bg-white border border-line rounded-xl outline-none focus:border-paprika-500 focus:ring-2 focus:ring-paprika-100";

const PaymentPage = ({ user, setCartItems, setCartCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems = [], subtotal, deliveryCharge = 0, grandTotal = 0, calories = null } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });

  const handleInputChange = (e) => setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });

  const handlePayment = async () => {
    setIsProcessing(true);

    const order = {
      id: newOrderId(),
      owner: ownerKey(user),
      createdAt: new Date().toISOString(),
      items: cartItems.map(({ id, name, qty, price, image, restaurantId, restaurantName }) => ({
        id, name, qty, price, image, restaurantId, restaurantName,
      })),
      restaurants: [...new Set(cartItems.map((i) => i.restaurantName).filter(Boolean))],
      subtotal: subtotal ?? cartItems.reduce((t, i) => t + i.price * i.qty, 0),
      deliveryCharge,
      total: grandTotal,
      paymentMethod,
      calories,
      status: 'Placed',
    };

    // Pretend to talk to a payment provider, then keep the order in history
    await new Promise((resolve) => setTimeout(resolve, 1200));
    let saved = true;
    try {
      await saveOrder(order);
    } catch (err) {
      console.warn("Couldn't save the order to history:", err);
      saved = false;
    }

    setCartItems?.([]);
    setCartCount?.(0);
    navigate('/order-success', { replace: true, state: { order, saved } });
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-ink">Nothing to pay for</h1>
        <p className="mt-2 text-stone-warm">Your cart is empty. Add something from a restaurant first.</p>
        <Link to="/restaurent" className="inline-block mt-6 bg-paprika-600 hover:bg-paprika-700 text-white font-semibold rounded-full px-6 py-3">
          Browse restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-paprika-700">Payment</p>
      <h1 className="mt-1 font-display text-3xl md:text-5xl text-ink">Pay ₹{grandTotal}</h1>

      <div className="mt-8 grid md:grid-cols-5 gap-6 lg:gap-8">
        {/* Payment form */}
        <section className="md:col-span-3 bg-white rounded-3xl border border-line p-5 md:p-7">
          <p className="flex items-start gap-2 text-sm bg-paprika-50 text-paprika-800 rounded-2xl px-4 py-3">
            <FiAlertCircle className="mt-0.5 shrink-0" />
            This is a demo checkout. Don't enter real card or bank details; any text works.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-2 md:gap-3">
            {METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setPaymentMethod(id)}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-3 rounded-2xl border text-sm font-semibold transition ${
                  paymentMethod === id ? 'border-paprika-600 bg-paprika-50 text-paprika-700' : 'border-line text-ink hover:border-stone-warm'
                }`}
              >
                <Icon size={18} /> {label}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4">
            {paymentMethod === 'card' && (
              <>
                <label className="block">
                  <span className="block text-sm font-semibold text-ink mb-1.5">Name on card</span>
                  <input name="name" value={cardDetails.name} onChange={handleInputChange} placeholder="Demo User" className={inputClass} />
                </label>
                <label className="block">
                  <span className="block text-sm font-semibold text-ink mb-1.5">Card number</span>
                  <input name="cardNumber" value={cardDetails.cardNumber} onChange={handleInputChange} placeholder="0000 0000 0000 0000" maxLength="19" className={inputClass} />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-semibold text-ink mb-1.5">Expiry</span>
                    <input name="expiry" value={cardDetails.expiry} onChange={handleInputChange} placeholder="MM/YY" maxLength="5" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-semibold text-ink mb-1.5">CVV</span>
                    <input type="password" name="cvv" value={cardDetails.cvv} onChange={handleInputChange} placeholder="•••" maxLength="4" className={inputClass} />
                  </label>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <label className="block">
                <span className="block text-sm font-semibold text-ink mb-1.5">UPI ID</span>
                <input placeholder="demo@upi" className={inputClass} />
              </label>
            )}

            {paymentMethod === 'netbanking' && (
              <label className="block">
                <span className="block text-sm font-semibold text-ink mb-1.5">Bank</span>
                <select className={inputClass}>
                  <option>SBI</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </label>
            )}
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full mt-7 flex items-center justify-center gap-2 bg-paprika-600 hover:bg-paprika-700 disabled:bg-stone-warm text-white font-semibold py-4 rounded-2xl"
          >
            <FiLock /> {isProcessing ? 'Placing your order…' : `Pay ₹${grandTotal}`}
          </button>
        </section>

        {/* Order summary */}
        <aside className="md:col-span-2">
          <div className="grain bg-cream rounded-3xl border border-line p-5 md:p-6 md:sticky md:top-24">
            <h2 className="font-bold text-ink">Order summary</h2>
            <ul className="mt-4 space-y-3 max-h-80 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <li key={item.id} className="flex justify-between gap-3 text-sm">
                  <span className="text-ink"><span className="font-semibold">{item.qty} ×</span> {item.name}</span>
                  <span className="font-semibold shrink-0">₹{item.price * item.qty}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 pt-4 border-t border-line space-y-1.5 text-sm">
              <div className="flex justify-between"><dt className="text-stone-warm">Delivery</dt><dd>{deliveryCharge ? `₹${deliveryCharge}` : "Free"}</dd></div>
              <div className="flex justify-between text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold">₹{grandTotal}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PaymentPage;

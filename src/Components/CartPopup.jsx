import { useNavigate, useLocation } from "react-router-dom";
import { FiShoppingBag, FiArrowRight } from "react-icons/fi";

// Slim bar at the bottom while the cart has items (hidden on checkout pages)
export default function CartPopup({ cartItems }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const totalItems = cartItems.reduce((total, item) => total + item.qty, 0);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.qty, 0);
  const restaurants = [...new Set(cartItems.map((i) => i.restaurantName).filter(Boolean))];

  if (cartItems.length === 0 || ["/checkout", "/payment", "/order-success"].includes(pathname)) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 px-3 pb-3 sm:pb-4 pointer-events-none">
      <div className="pointer-events-auto max-w-3xl mx-auto flex items-center gap-3 bg-ink text-white rounded-2xl shadow-xl px-4 py-3">
        <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
          <FiShoppingBag size={20} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-bold">
            {totalItems} {totalItems === 1 ? "item" : "items"} · ₹{totalPrice.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-white/70 truncate">
            {restaurants.length ? `From ${restaurants.join(", ")}` : "Ready when you are"}
          </p>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="shrink-0 flex items-center gap-2 bg-paprika-600 hover:bg-paprika-500 font-semibold text-sm rounded-xl px-4 py-2.5"
        >
          View cart <FiArrowRight />
        </button>
      </div>
    </div>
  );
}

import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem.jsx";

const Cart = () => {
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-8">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ink/50 mb-4">Your shopping cart is currently empty.</p>
          <Link to="/" className="text-clay underline font-semibold">Start exploring products</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          <div className="bg-white border border-ink/10 rounded-2xl p-6 h-fit sticky top-24 space-y-4">
            <h3 className="text-xl font-bold">Order Summary</h3>
            <div className="flex justify-between text-sm">
              <span className="text-ink/60">Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-ink/60">Standard Delivery</span>
              <span className="text-moss font-semibold">Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t border-ink/10 pt-4">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-ink text-white rounded-full py-3 hover:bg-plum transition-colors font-semibold"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../redux/slices/cartSlice.js";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  // Calculate pricing
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shippingFee;

  const handleCheckout = () => {
    if (!user) {
      navigate("/login", { state: { from: "/checkout" } });
    } else {
      navigate("/checkout");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-neutral-400">
          🛒
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-sm text-neutral-500 mb-6">
          Looks like you haven't added any handcrafted items to your cart yet.
        </p>
        <Link
          to="/"
          className="bg-black hover:bg-neutral-800 text-white px-6 py-3 rounded-full text-sm font-semibold transition-colors inline-block"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
          Shopping Cart ({cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)})
        </h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-xs text-neutral-400 hover:text-red-600 underline cursor-pointer"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 divide-y divide-neutral-100">
          {cartItems.map((item) => {
            const imgSrc =
              item.image ||
              item.imageUrl ||
              item.images?.[0] ||
              "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80";

            return (
              <div
                key={item._id}
                className="py-5 flex items-center justify-between gap-4"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 flex-1">
                  <img
                    src={imgSrc}
                    alt={item.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl bg-neutral-100"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80";
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-neutral-900 text-sm sm:text-base line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs text-neutral-400 capitalize">
                      {item.category}
                    </p>
                    <span className="text-sm font-extrabold text-neutral-900 mt-1 block">
                      ₹{item.price}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-neutral-200 rounded-full px-3 py-1 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item._id,
                          qty: Math.max(1, (item.qty || 1) - 1),
                        })
                      )
                    }
                    className="text-sm font-bold text-neutral-500 hover:text-black cursor-pointer"
                  >
                    -
                  </button>
                  <span className="text-xs font-semibold w-4 text-center">
                    {item.qty || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item._id,
                          qty: (item.qty || 1) + 1,
                        })
                      )
                    }
                    className="text-sm font-bold text-neutral-500 hover:text-black cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Item Total & Remove */}
                <div className="text-right">
                  <span className="font-bold text-neutral-900 text-sm block">
                    ₹{(item.price * (item.qty || 1)).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="text-xs text-red-500 hover:text-red-700 underline mt-1 cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-neutral-50 border border-neutral-200/60 rounded-3xl p-6 h-fit space-y-4">
          <h2 className="font-bold text-neutral-900 text-lg">Order Summary</h2>

          <div className="space-y-2 text-sm text-neutral-600 pb-4 border-b border-neutral-200">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-900">
                ₹{subtotal.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-neutral-900">
                {shippingFee === 0 ? "FREE" : `₹${shippingFee}`}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center text-base font-extrabold text-neutral-900">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-black hover:bg-neutral-800 text-white py-3.5 rounded-full font-semibold text-sm transition-colors cursor-pointer mt-4"
          >
            {user ? "Proceed to Checkout" : "Sign In to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "../redux/slices/cartSlice.js";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  const [address, setAddress] = useState({
    street: user?.address?.street || "4/41, Natarajan illam",
    city: user?.address?.city || "Tharagampatti",
    state: user?.address?.state || "Tamil Nadu, Karur",
    zip: user?.address?.zip || "kadavur",
    country: user?.address?.country || "India",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * (item.qty || 1),
    0
  );
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 50;
  const total = subtotal + shippingFee;

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError("");

    const activeCart =
      cartItems && cartItems.length > 0
        ? cartItems
        : JSON.parse(localStorage.getItem("cartItems") || "[]");

    if (!activeCart || activeCart.length === 0) {
      setError("Cannot place an order with an empty cart.");
      return;
    }

    const formattedItems = activeCart.map((item) => ({
      _id: item._id,
      product: item._id,
      name: item.name,
      price: item.price,
      qty: item.qty || 1,
      quantity: item.qty || 1,
      image:
        item.image ||
        item.imageUrl ||
        "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80",
    }));

    const calculatedTotal = Number(total > 0 ? total : 59);

    const orderPayload = {
      orderItems: formattedItems,
      items: formattedItems,
      shippingAddress: address,
      totalAmount: calculatedTotal,
      totalPrice: calculatedTotal,
      paymentMethod: "Cash on Delivery",
    };

    if (!user) {
      sessionStorage.setItem("pendingOrder", JSON.stringify(orderPayload));
      navigate("/login", { state: { from: "/checkout", defaultTab: "register" } });
      return;
    }

    try {
      setLoading(true);
      const token =
        user?.token ||
        JSON.parse(localStorage.getItem("user") || "{}")?.token;

      const response = await axios.post("http://localhost:5000/api/orders", orderPayload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch(clearCart());
      sessionStorage.removeItem("pendingOrder");

      const createdOrderId = response.data?._id || response.data?.order?._id;
      if (createdOrderId) {
        navigate(`/order-success/${createdOrderId}`);
      } else {
        navigate("/orders");
      }
    } catch (err) {
      console.error("Order error:", err);
      setError(err.response?.data?.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 mb-8">
        Checkout
      </h1>

      <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h2 className="text-base font-semibold text-neutral-800 mb-4">
          Shipping Details
        </h2>

        {error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="space-y-4">
          <div>
            <input
              type="text"
              name="street"
              required
              value={address.street}
              onChange={handleChange}
              placeholder="Street Address"
              className="w-full bg-[#ecf2fe] border-none rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="city"
              required
              value={address.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full bg-[#ecf2fe] border-none rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:ring-1 focus:ring-black"
            />
            <input
              type="text"
              name="state"
              required
              value={address.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full bg-[#ecf2fe] border-none rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              name="zip"
              required
              value={address.zip}
              onChange={handleChange}
              placeholder="ZIP / Postal Code"
              className="w-full bg-[#ecf2fe] border-none rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:ring-1 focus:ring-black"
            />
            <input
              type="text"
              name="country"
              required
              value={address.country}
              onChange={handleChange}
              placeholder="Country"
              className="w-full bg-white border border-neutral-200 rounded-xl px-4 py-3 text-sm text-neutral-800 outline-none focus:border-black"
            />
          </div>

          <div className="flex items-center justify-between pt-6 pb-2 text-neutral-900">
            <span className="font-serif font-bold text-base sm:text-lg">
              Total (Cash on Delivery)
            </span>
            <span className="font-serif font-bold text-base sm:text-lg">
              ₹{(total > 0 ? total : 59).toFixed(2)}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 hover:bg-black text-white py-3.5 rounded-full font-medium text-sm transition-colors cursor-pointer mt-2 disabled:bg-neutral-400"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
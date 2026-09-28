import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const storedUser = JSON.parse(localStorage.getItem("user") || "null");
        const token = user?.token || storedUser?.token;

        if (!token) {
          setError("Session expired. Please sign in again.");
          setLoading(false);
          return;
        }

        const { data } = await axios.get("http://localhost:5000/api/orders/myorders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Order fetch error:", err);
        setError(err.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-28 text-center text-neutral-500 font-sans">
        Loading your orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center font-sans">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Error</h2>
        <p className="text-xs text-red-600 mb-6">{error}</p>
        <Link
          to="/login"
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
        >
          Sign In
        </Link>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center font-sans">
        <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl text-neutral-400">
          📦
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">No orders placed yet</h2>
        <p className="text-xs text-neutral-500 mb-6">
          Explore our curated collections and place your first order.
        </p>
        <Link
          to="/"
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100">
        <div>
          <h1 className="text-3xl font-serif font-bold text-neutral-900">My Orders</h1>
          <p className="text-xs text-neutral-400 mt-1">Showing all {orders.length} orders placed</p>
        </div>
        <Link to="/" className="text-xs font-semibold text-neutral-600 hover:text-black underline">
          Continue Shopping
        </Link>
      </div>

      <div className="space-y-8">
        {orders.map((order) => {
          const itemsList = order.orderItems || order.items || order.cartItems || [];
          const totalAmt = order.totalAmount || order.totalPrice || 0;
          const isDelivered = Boolean(order.isDelivered);

          const statusSteps = [
            { title: "Order Placed", done: true },
            { title: "Processing", done: true },
            { title: "Shipped", done: isDelivered },
            { title: "Delivered", done: isDelivered },
          ];

          return (
            <div
              key={order._id}
              className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-7 shadow-sm"
            >
              {/* Header */}
              <div className="flex flex-wrap justify-between items-center pb-4 border-b border-neutral-100 text-xs text-neutral-500 gap-2">
                <div>
                  <span className="font-semibold text-neutral-800">Order ID: </span>
                  <span className="font-mono text-neutral-700 font-bold">{order._id}</span>
                </div>
                <div>
                  <span className="font-semibold text-neutral-800">Placed on: </span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="text-sm font-extrabold text-neutral-900">
                  Total: ₹{Number(totalAmt).toFixed(2)}
                </div>
              </div>

              {/* Live Status Progress Bar */}
              <div className="py-6 px-2 sm:px-6">
                <div className="grid grid-cols-4 gap-2 text-center relative">
                  {statusSteps.map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                          step.done
                            ? "bg-black text-white"
                            : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                        }`}
                      >
                        {step.done ? "✓" : idx + 1}
                      </div>
                      <span className="text-[11px] sm:text-xs font-semibold text-neutral-800 mt-2">
                        {step.title}
                      </span>
                    </div>
                  ))}

                  {/* Connecting Line */}
                  <div className="absolute top-3.5 sm:top-4 left-6 right-6 h-0.5 bg-neutral-200 -z-0">
                    <div
                      className={`h-full bg-black transition-all ${
                        isDelivered ? "w-full" : "w-1/2"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Product Items List */}
              <div className="divide-y divide-neutral-100 border-t border-b border-neutral-100 py-2">
                {itemsList.map((item, idx) => {
                  const itemImage =
                    item.image ||
                    item.imageUrl ||
                    item.images?.[0] ||
                    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80";

                  const itemName = item.name || item.title || "Handcrafted Item";
                  const itemQty = item.qty || item.quantity || 1;
                  const itemPrice = item.price || 0;

                  return (
                    <div key={item._id || idx} className="py-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 flex-1">
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-14 h-14 rounded-xl object-cover bg-neutral-100 flex-shrink-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80";
                          }}
                        />
                        <div>
                          <p className="font-bold text-neutral-900 text-sm line-clamp-1">{itemName}</p>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            Qty: {itemQty} × ₹{itemPrice}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-neutral-900 text-sm">
                        ₹{(itemPrice * itemQty).toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer Details */}
              <div className="pt-4 flex flex-wrap justify-between items-center text-xs text-neutral-600 gap-3">
                <div>
                  Payment Method: <b className="text-neutral-900">{order.paymentMethod || "Cash on Delivery"}</b>
                </div>
                <div>
                  Delivery Status:{" "}
                  <span
                    className={`font-semibold px-2.5 py-0.5 rounded-full ${
                      isDelivered
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {isDelivered ? "Delivered" : "Processing"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Orders;
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const OrderSuccess = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = user?.token || JSON.parse(localStorage.getItem("user"))?.token;
        const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrder(data);
      } catch (err) {
        console.error("Order fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchOrder();
  }, [id, user]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-28 text-center text-neutral-500 font-sans">
        Loading order status...
      </div>
    );
  }

  // Fallback defaults if fetching fails
  const statusSteps = [
    { title: "Order Placed", done: true, time: "Just now" },
    { title: "Processing", done: true, time: "In Progress" },
    { title: "Shipped", done: order?.isDelivered || false, time: "Expected soon" },
    { title: "Delivered", done: order?.isDelivered || false, time: "3-5 business days" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans">
      {/* Success Badge */}
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-green-100 text-green-700 rounded-full flex items-center justify-center mx-auto text-2xl mb-3 shadow-inner">
          ✓
        </div>
        <h1 className="text-3xl font-serif font-bold text-neutral-900 mb-1">
          Thank you! Order Placed
        </h1>
        <p className="text-xs text-neutral-500">
          Order ID: <span className="font-mono font-bold text-neutral-800">{id}</span>
        </p>
      </div>

      {/* Live Order Status Tracker */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 sm:p-8 mb-8 shadow-sm">
        <h2 className="text-base font-bold text-neutral-900 mb-6">Delivery Status</h2>

        <div className="grid grid-cols-4 gap-2 text-center relative">
          {statusSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative z-10">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step.done
                    ? "bg-black text-white"
                    : "bg-neutral-100 text-neutral-400 border border-neutral-200"
                }`}
              >
                {step.done ? "✓" : index + 1}
              </div>
              <span className="text-xs font-semibold text-neutral-800 mt-2">
                {step.title}
              </span>
              <span className="text-[10px] text-neutral-400 hidden sm:block">
                {step.time}
              </span>
            </div>
          ))}

          {/* Progress Connecting Line */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-neutral-200 -z-0">
            <div className="h-full bg-black w-2/5"></div>
          </div>
        </div>
      </div>

      {/* Order Summary & Shipping Details */}
      <div className="bg-neutral-50 border border-neutral-200/80 rounded-3xl p-6 sm:p-8 space-y-6">
        <div>
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
            Items Ordered
          </h3>
          <div className="divide-y divide-neutral-200">
            {(order?.orderItems || order?.items || []).map((item, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-white border border-neutral-200"
                  />
                  <div>
                    <h4 className="font-bold text-neutral-900 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-neutral-500">Qty: {item.qty || item.quantity || 1}</p>
                  </div>
                </div>
                <span className="font-bold text-neutral-900">
                  ₹{item.price * (item.qty || item.quantity || 1)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4 flex justify-between items-center text-base font-extrabold text-neutral-900">
          <span>Total Paid (Cash on Delivery)</span>
          <span>₹{order?.totalAmount || order?.totalPrice || "0.00"}</span>
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Shipping Address
          </h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {order?.shippingAddress?.street}, {order?.shippingAddress?.city},{" "}
            {order?.shippingAddress?.state} - {order?.shippingAddress?.zip},{" "}
            {order?.shippingAddress?.country}
          </p>
        </div>

        <div className="pt-4 flex gap-3">
          <Link
            to="/orders"
            className="flex-1 bg-black text-white text-center py-3 rounded-full text-xs font-semibold hover:bg-neutral-800 transition-colors"
          >
            View All Orders
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white border border-neutral-300 text-neutral-800 text-center py-3 rounded-full text-xs font-semibold hover:bg-neutral-100 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
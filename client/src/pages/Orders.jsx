import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/thunks/orderThunks.js";

const badgeClasses = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const Orders = () => {
  const dispatch = useDispatch();
  const { orders = [], loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="text-3xl font-extrabold mb-8">Order History</h1>

      {loading ? (
        <p className="text-ink/50">Retrieving confirmed orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-ink/50">You have not placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="bg-white border border-ink/10 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-ink/60">ID: #{o._id.slice(-8)}</span>
                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${badgeClasses[o.status] || "bg-gray-100"}`}>
                  {o.status}
                </span>
              </div>
              <div className="divide-y divide-ink/5">
                {o.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-2 text-sm">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between font-bold pt-3 border-t border-ink/10 mt-2">
                <span>Total Amount Paid</span>
                <span>₹{o.totalAmount}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
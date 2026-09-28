import React from "react";
import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice.js";
import { FiTrash2 } from "react-icons/fi";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <div className="flex items-center gap-4 border-b border-ink/10 py-4">
      <div className="w-20 h-20 bg-sand rounded-xl overflow-hidden shrink-0">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-semibold">{item.name}</h4>
        <p className="text-sm text-ink/50">₹{item.price} each</p>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity - 1 }))}
            className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center font-bold"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
          <button
            onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: item.quantity + 1 }))}
            className="w-7 h-7 rounded-full border border-ink/20 flex items-center justify-center font-bold"
          >
            +
          </button>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold">₹{item.price * item.quantity}</p>
        <button onClick={() => dispatch(removeFromCart(item.productId))} className="text-red-500 mt-2 p-1">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
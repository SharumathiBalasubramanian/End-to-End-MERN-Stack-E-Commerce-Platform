import React from "react";
import { useDispatch } from "react-redux";
import { updateQuantity, removeFromCart } from "../redux/slices/cartSlice.js";

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const imgSrc =
    item?.image ||
    item?.imageUrl ||
    item?.images?.[0] ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=400&q=80";

  return (
    <div className="flex items-center justify-between py-4 border-b border-neutral-100 gap-4">
      {/* Product Image & Info */}
      <div className="flex items-center gap-4 flex-1">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl bg-neutral-100"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80";
          }}
        />
        <div>
          <h4 className="font-bold text-neutral-900 text-sm sm:text-base line-clamp-1">
            {item.name}
          </h4>
          <p className="text-xs text-neutral-400 capitalize">{item.category}</p>
          <span className="text-sm font-extrabold text-neutral-900 mt-1 block">
            ₹{item.price}
          </span>
        </div>
      </div>

      {/* Quantity Controllers */}
      <div className="flex items-center border border-neutral-200 rounded-full px-2 py-1 gap-2">
        <button
          type="button"
          onClick={() =>
            dispatch(
              updateQuantity({ id: item._id, qty: Math.max(1, (item.qty || 1) - 1) })
            )
          }
          className="w-6 h-6 flex items-center justify-center font-bold text-neutral-600 hover:text-black cursor-pointer"
        >
          -
        </button>
        <span className="text-sm font-semibold w-4 text-center">
          {item.qty || 1}
        </span>
        <button
          type="button"
          onClick={() =>
            dispatch(
              updateQuantity({ id: item._id, qty: (item.qty || 1) + 1 })
            )
          }
          className="w-6 h-6 flex items-center justify-center font-bold text-neutral-600 hover:text-black cursor-pointer"
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
};

export default CartItem;
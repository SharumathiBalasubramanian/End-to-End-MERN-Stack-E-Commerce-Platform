import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../redux/slices/cartSlice.js";

const ProductCard = ({ product = {} }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const id = product._id || product.id;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(
      addToCart({
        productId: id,
        name: product.name,
        price: product.price,
        image: product.image,
        stock: product.stock ?? 10,
        quantity: 1,
      })
    );
  };

  return (
    <div
      onClick={() => navigate(`/products/${id}`)}
      className="bg-white rounded-2xl border border-gray-100/80 p-3.5 flex flex-col justify-between cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      <div>
        {/* Soft Sand Rounded Image Box */}
        <div className="w-full h-44 mb-3.5 overflow-hidden rounded-xl bg-[#F0ECE6] flex items-center justify-center">
          <img
            src={product.image || "https://via.placeholder.com/300x200"}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Terracotta Category Label */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#D95D39] block mb-1">
          {product.category || "ELECTRONICS"}
        </span>

        {/* Product Title */}
        <h3 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-1">
          {product.name}
        </h3>

        {/* Short Subtitle / Description */}
        <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed font-normal">
          {product.description}
        </p>
      </div>

      {/* Footer Row: Price + Rating on Left, Black Button on Right */}
      <div className="mt-4 pt-3 flex items-center justify-between border-t border-gray-100">
        <div>
          <span className="text-base font-bold text-gray-900">
            ₹{product.price}
          </span>
          <div className="text-[11px] text-amber-500 font-medium flex items-center gap-1 mt-0.5">
            <span>★</span> {product.ratings || 4.5}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          className="bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium px-4 py-2 rounded-full transition active:scale-95 shadow-2xs"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
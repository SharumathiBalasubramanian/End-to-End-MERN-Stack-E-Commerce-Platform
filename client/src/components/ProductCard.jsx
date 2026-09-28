import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice.js";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  // Fallback check for MongoDB _id or custom id
  const productId = product?._id || product?.id;

  const imgSrc =
    product?.image ||
    product?.imageUrl ||
    product?.images?.[0] ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80";

  const handleAddToCart = (e) => {
    // Stops the card from navigating to the details page when clicking "Add to Cart"
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="bg-white border border-neutral-100 rounded-3xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
      {/* Clickable Card Link for Image */}
      <Link
        to={`/products/${productId}`}
        className="block overflow-hidden rounded-2xl mb-4 bg-neutral-100 h-56"
      >
        <img
          src={imgSrc}
          alt={product?.name || "Product"}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80";
          }}
        />
      </Link>

      {/* Info Section */}
      <div>
        <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wider mb-1">
          {product?.category || "Artisan Craft"}
        </p>
        <Link to={`/products/${productId}`}>
          <h3 className="font-bold text-neutral-900 text-base line-clamp-1 hover:underline cursor-pointer mb-1">
            {product?.name}
          </h3>
        </Link>
        <p className="text-xs text-neutral-400 line-clamp-2 mb-4">
          {product?.description}
        </p>
      </div>

      {/* Footer / Price & Add to Cart */}
      <div className="flex items-center justify-between pt-2 border-t border-neutral-50">
        <div>
          <span className="text-base font-extrabold text-neutral-900">
            ₹{product?.price}
          </span>
          <div className="text-[11px] text-amber-500 font-semibold">
            ★ {product?.rating || 4.8}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className={`text-xs font-semibold px-4 py-2 rounded-full cursor-pointer transition-colors ${
            added
              ? "bg-green-600 text-white"
              : "bg-black hover:bg-neutral-800 text-white"
          }`}
        >
          {added ? "✓ Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
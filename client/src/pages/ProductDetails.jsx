import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addToCart } from "../redux/slices/cartSlice.js";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Try getting products from existing Redux state first
  const { products } = useSelector((state) => state.products || { products: [] });

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError("");

      // 1. Check if the product is already loaded in Redux products array
      const existingProduct = products?.find(
        (p) => String(p._id) === String(id) || String(p.id) === String(id)
      );

      if (existingProduct) {
        setProduct(existingProduct);
        setLoading(false);
        return;
      }

      // 2. If not found in Redux, fetch from backend
      try {
        const res = await axios.get(`http://localhost:5000/api/products/${id}`);
        const data = res.data?.data || res.data;

        if (data && (data._id || data.name)) {
          setProduct(data);
        } else {
          setError("Product details could not be found.");
        }
      } catch (err) {
        console.error("API error:", err);
        setError(err.response?.data?.message || "Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadProduct();
    }
  }, [id, products]);

  const handleAddToCart = () => {
    if (!product) return;
    dispatch(addToCart({ ...product, qty: Number(qty) }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    if (!product) return;
    dispatch(addToCart({ ...product, qty: Number(qty) }));
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-28 text-center text-neutral-500">
        Loading product details...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center">
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Product Not Found</h2>
        <p className="text-xs text-neutral-500 mb-6">{error || "Could not retrieve this item."}</p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-6 py-2.5 rounded-full text-xs font-semibold cursor-pointer"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const imgSrc =
    product.image ||
    product.imageUrl ||
    product.images?.[0] ||
    "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80";

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-semibold text-neutral-500 hover:text-black mb-8 flex items-center gap-1 cursor-pointer"
      >
        ← Back to Shop
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Product Image */}
        <div className="bg-neutral-100 rounded-3xl overflow-hidden shadow-sm aspect-square flex items-center justify-center">
          <img
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover object-center"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80";
            }}
          />
        </div>

        {/* Details Column */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
              {product.category || "Handcrafted"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-neutral-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-amber-500 font-bold text-sm">
                ★ {product.rating || 4.8}
              </span>
              <span className="text-xs text-neutral-300">|</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium text-green-700 bg-green-50">
                In Stock
              </span>
            </div>
          </div>

          <div className="text-3xl font-extrabold text-neutral-900">
            ₹{product.price}
          </div>

          <div className="border-t border-b border-neutral-100 py-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
              Description
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              {product.description || "Handmade with artisan care and premium craft materials."}
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
            <div className="flex items-center border border-neutral-200 rounded-full px-3 py-1 gap-3">
              <button
                type="button"
                onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                className="text-base font-bold text-neutral-500 hover:text-black cursor-pointer"
              >
                -
              </button>
              <span className="text-xs font-semibold w-4 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((prev) => prev + 1)}
                className="text-base font-bold text-neutral-500 hover:text-black cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 rounded-full font-semibold text-sm transition-colors cursor-pointer ${
                added
                  ? "bg-green-600 text-white"
                  : "bg-neutral-900 hover:bg-black text-white"
              }`}
            >
              {added ? "✓ Added to Cart" : "Add to Cart"}
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 py-3.5 rounded-full font-semibold text-sm border border-neutral-900 text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
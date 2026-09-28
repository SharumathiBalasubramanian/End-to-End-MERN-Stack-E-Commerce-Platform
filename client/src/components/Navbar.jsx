import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice.js";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  // Calculate total number of items in the cart
  const totalCartCount = cartItems.reduce(
    (acc, item) => acc + (item.qty || item.quantity || 1),
    0
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-1.5">
          <span className="text-xl sm:text-2xl font-serif font-black tracking-tight text-neutral-900">
            Urban Craft<span className="text-amber-700">.</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-5 sm:gap-7 text-xs sm:text-sm font-medium text-neutral-700">
          <Link to="/" className="hover:text-black transition-colors">
            Shop
          </Link>

          <Link to="/contact" className="hover:text-black transition-colors">
            Contact
          </Link>

          {/* Orders Link (Plain link without number badge) */}
          {user && (
            <Link
              to="/orders"
              className="hover:text-black transition-colors font-medium"
            >
              Orders
            </Link>
          )}

          {/* Cart Link with count badge */}
          <Link
            to="/cart"
            className="flex items-center gap-1.5 hover:text-black transition-colors font-medium"
          >
            <span>Cart</span>
            {totalCartCount > 0 && (
              <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                {totalCartCount}
              </span>
            )}
          </Link>

          {/* User Auth Info & Actions */}
          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-neutral-200">
              <span className="text-neutral-500 text-xs hidden sm:inline">
                Hi,{" "}
                <b className="text-neutral-900">
                  {user.name?.split(" ")[0] || "User"}
                </b>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-red-500 hover:text-red-700 font-semibold cursor-pointer underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-black hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors ml-2"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
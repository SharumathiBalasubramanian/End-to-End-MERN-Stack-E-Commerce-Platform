import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FiSearch, FiShoppingBag, FiMenu, FiX, FiUser } from "react-icons/fi";
import { logout } from "../redux/slices/authSlice.js";

const Navbar = () => {
  // SET YOUR BRAND NAME HERE:
  const BRAND_NAME = "Urban Craft";

  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((acc, i) => acc + i.quantity, 0)
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/?keyword=${encodeURIComponent(search)}`);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
        {/* Brand Name Logo */}
        <Link to="/" className="text-xl font-bold tracking-tight text-gray-900 shrink-0">
          {BRAND_NAME}<span className="text-[#D95D39]">.</span>
        </Link>

        {/* Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-lg items-center border border-gray-200 rounded-full px-4 py-2 bg-white shadow-2xs focus-within:border-gray-400 transition"
        >
          <FiSearch className="text-gray-400 mr-2 text-sm" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search essentials..."
            className="w-full bg-transparent outline-none text-sm placeholder:text-gray-400 text-gray-800"
          />
        </form>

        {/* Right Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-black transition hidden sm:block">Shop</Link>
          <Link to="/contact" className="hover:text-black transition hidden sm:block">Contact</Link>
          {user && <Link to="/orders" className="hover:text-black transition hidden sm:block">Orders</Link>}

          {/* Cart Icon */}
          <Link to="/cart" className="relative flex items-center p-1 text-gray-800 hover:text-black">
            <FiShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#D95D39] text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth Button */}
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-600 font-semibold flex items-center gap-1">
                <FiUser /> {user.name?.split(" ")[0]}
              </span>
              <button
                onClick={() => dispatch(logout())}
                className="bg-black text-white text-xs px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-[#1A1A1A] hover:bg-black text-white text-xs px-5 py-2.5 rounded-full font-medium tracking-wide transition shadow-2xs"
            >
              Login
            </Link>
          )}

          <button onClick={() => setOpen(!open)} className="md:hidden text-gray-700">
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
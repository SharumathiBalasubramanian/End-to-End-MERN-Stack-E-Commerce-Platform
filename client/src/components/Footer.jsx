import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiInstagram, FiTwitter, FiGithub } from "react-icons/fi";

const Footer = () => {
  const brandName = "Urban Craft"; // <-- Change your brand name here

  return (
    <footer className="bg-[#161616] text-[#FAF8F5]/70 mt-28 border-t border-black/10">
      <div className="max-w-7xl mx-auto px-6 py-14">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-white/10 text-sm">
          {/* Brand Info & Newsletter (2 Cols) */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="text-2xl font-bold text-white tracking-tight inline-block">
              {brandName}<span className="text-[#D95D39]">.</span>
            </Link>
            <p className="text-xs text-white/50 leading-relaxed max-w-sm">
              Thoughtfully curated everyday essentials, designed for functional utility and timeless durability.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/70 block mb-2">
                Subscribe for drops & updates
              </span>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center max-w-sm">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/5 border border-white/15 rounded-l-full px-4 py-2.5 text-xs text-white placeholder:text-white/30 outline-none w-full focus:border-white/40 transition"
                />
                <button
                  type="submit"
                  className="bg-white text-black px-4 py-2.5 rounded-r-full text-xs font-semibold hover:bg-[#D95D39] hover:text-white transition flex items-center justify-center shrink-0"
                >
                  <FiArrowRight size={14} />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60">
              <li>
                <Link to="/" className="hover:text-white transition">Shop All</Link>
              </li>
              <li>
                <Link to="/?category=Electronics" className="hover:text-white transition">Electronics</Link>
              </li>
              <li>
                <Link to="/?category=Accessories" className="hover:text-white transition">Accessories</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">Your Bag</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care Column */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Customer Care
            </h4>
            <ul className="space-y-2.5 text-xs text-white/60">
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Us</Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition">Track Orders</Link>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">Shipping & Returns</span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-white transition">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Socials & Status */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Connect
            </h4>
            <div className="flex gap-3 text-white/70 mb-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition">
                <FiInstagram size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition">
                <FiTwitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white hover:text-black transition">
                <FiGithub size={14} />
              </a>
            </div>
            <p className="text-[11px] text-white/40">
              Need help? Support is open Monday–Friday 9AM–6PM IST.
            </p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} {brandName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-white cursor-pointer transition">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition">Security</span>
            <span className="hover:text-white cursor-pointer transition">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
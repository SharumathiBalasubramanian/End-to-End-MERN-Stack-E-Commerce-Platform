import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../redux/thunks/productThunks.js";
import { setFilters } from "../redux/slices/productSlice.js";
import ProductCard from "../components/ProductCard.jsx";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Home = () => {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Extract pagination states from Redux
  const {
    items = [],
    loading,
    categories = [],
    filters = {},
    pages = 1,
    page = 1,
  } = useSelector((state) => state.products || {});

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    const keyword = searchParams.get("keyword") || "";
    dispatch(setFilters({ keyword }));
  }, [searchParams, dispatch]);

  // Refetch when filters change (resets to page 1)
  useEffect(() => {
    dispatch(fetchProducts({ ...filters, page: 1, limit: 12 }));
  }, [dispatch, filters.keyword, filters.category, filters.minPrice, filters.maxPrice, filters.sort]);

  const handleFilterUpdate = (patch) => {
    dispatch(setFilters(patch));
  };

  // Pagination page click handler
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      dispatch(fetchProducts({ ...filters, page: newPage, limit: 12 }));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero Title */}
      <section className="mb-9">
        <h1 className="font-serif-hero text-4xl sm:text-5xl md:text-[54px] text-gray-900 leading-[1.12] tracking-tight max-w-2xl font-medium">
          Built with purpose. Crafted to endure.
        </h1>
      </section>

      {/* Pill Filter Bar */}
      <div className="flex flex-wrap gap-2.5 mb-10 items-center">
        <select
          value={filters.category || ""}
          onChange={(e) => handleFilterUpdate({ category: e.target.value })}
          className="bg-white border border-gray-200/90 rounded-full px-4 py-2 text-xs font-medium text-gray-700 shadow-2xs outline-none cursor-pointer"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={filters.minPrice || ""}
          onChange={(e) => handleFilterUpdate({ minPrice: e.target.value })}
          className="bg-white border border-gray-200/90 rounded-full px-4 py-2 text-xs font-medium text-gray-700 placeholder:text-gray-400 w-28 shadow-2xs outline-none"
        />

        <input
          type="number"
          placeholder="Max price"
          value={filters.maxPrice || ""}
          onChange={(e) => handleFilterUpdate({ maxPrice: e.target.value })}
          className="bg-white border border-gray-200/90 rounded-full px-4 py-2 text-xs font-medium text-gray-700 placeholder:text-gray-400 w-28 shadow-2xs outline-none"
        />

        <select
          value={filters.sort || "newest"}
          onChange={(e) => handleFilterUpdate({ sort: e.target.value })}
          className="bg-white border border-gray-200/90 rounded-full px-4 py-2 text-xs font-medium text-gray-700 shadow-2xs outline-none cursor-pointer"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 text-sm text-gray-400">Loading products...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 text-sm text-gray-400">No products match your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((p) => (
            <ProductCard key={p._id || p.id} product={p} />
          ))}
        </div>
      )}

      {/* ========================================= */}
      {/* PAGINATION CONTROLS (Add this right here) */}
      {/* ========================================= */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-14 pt-6 border-t border-gray-200/60">
          {/* Previous Page Button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:border-gray-400 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
          >
            <FiChevronLeft size={16} />
          </button>

          {/* Numbered Page Buttons */}
          {Array.from({ length: pages }, (_, i) => i + 1).map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`w-9 h-9 rounded-full text-xs font-semibold transition shadow-2xs ${
                pageNum === page
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white border border-gray-200 text-gray-700 hover:border-gray-400"
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Page Button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === pages}
            className="w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:border-gray-400 transition disabled:opacity-30 disabled:cursor-not-allowed shadow-2xs"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
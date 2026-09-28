import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard.jsx";
import { fetchProducts, fetchCategories } from "../redux/thunks/productThunks.js";
import { setFilters } from "../redux/slices/productSlice.js";

const Home = () => {
  const dispatch = useDispatch();

  const { products, categories, loading } = useSelector(
    (state) => state.products || { products: [], categories: [] }
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Pagination states: exactly 12 products per page
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fetch products & categories on initial load
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
  }, [dispatch]);

  // Safely extract products array
  const rawProductList = Array.isArray(products)
    ? products
    : products?.products || products?.data || [];

  // Filter products based on category and price range
  const filteredProducts = rawProductList.filter((product) => {
    if (!product) return false;

    const categoryMatches =
      selectedCategory === "All" ||
      selectedCategory === "All categories" ||
      !selectedCategory ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();

    const price = Number(product.price) || 0;
    const min = minPrice !== "" ? Number(minPrice) : null;
    const max = maxPrice !== "" ? Number(maxPrice) : null;

    const minMatches = min === null || isNaN(min) || price >= min;
    const maxMatches = max === null || isNaN(max) || price <= max;

    return categoryMatches && minMatches && maxMatches;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === "price-low") {
      return (a.price || 0) - (b.price || 0);
    }
    if (sortOption === "price-high") {
      return (b.price || 0) - (a.price || 0);
    }
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  // 12 Items Pagination slice logic
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = sortedProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  // Handlers (resets page back to 1 on filter changes)
  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    setCurrentPage(1);
    dispatch(setFilters({ category: val }));
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    setSortOption(val);
    setCurrentPage(1);
    dispatch(setFilters({ sort: val }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleReset = () => {
    setSelectedCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSortOption("newest");
    setCurrentPage(1);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 font-sans">
      {/* Hero Header */}
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-neutral-900 leading-tight">
          Built with purpose. Crafted to endure.
        </h1>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-10">
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="bg-white border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-black cursor-pointer shadow-sm"
        >
          <option value="All">All categories</option>
          {categories &&
            categories.map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setCurrentPage(1);
          }}
          className="w-28 bg-white border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-black shadow-sm"
        />

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setCurrentPage(1);
          }}
          className="w-28 bg-white border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-black shadow-sm"
        />

        <select
          value={sortOption}
          onChange={handleSortChange}
          className="bg-white border border-neutral-200 rounded-full px-4 py-2.5 text-xs text-neutral-800 outline-none focus:border-black cursor-pointer shadow-sm ml-auto"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>

        {(selectedCategory !== "All" || minPrice || maxPrice) && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-500 hover:text-black underline cursor-pointer px-2"
          >
            Reset
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && rawProductList.length === 0 && (
        <div className="text-center py-20 text-neutral-400 text-sm">
          Loading products...
        </div>
      )}

      {/* Empty State */}
      {!loading && sortedProducts.length === 0 && (
        <div className="text-center py-24">
          <p className="text-sm text-neutral-500">No products match your criteria.</p>
        </div>
      )}

      {/* 12-Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product._id || product.id}
            product={product}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 pt-6 border-t border-neutral-100">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-3.5 py-2 text-xs font-semibold rounded-full border border-neutral-200 text-neutral-700 hover:border-black disabled:opacity-40 disabled:hover:border-neutral-200 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            const pageNum = index + 1;
            const isActive = currentPage === pageNum;

            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full transition-colors cursor-pointer ${
                  isActive
                    ? "bg-black text-white shadow-sm"
                    : "text-neutral-700 hover:bg-neutral-100 border border-neutral-200"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-3.5 py-2 text-xs font-semibold rounded-full border border-neutral-200 text-neutral-700 hover:border-black disabled:opacity-40 disabled:hover:border-neutral-200 cursor-pointer disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
import Product from "../models/product.js";

export const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;
    const query = {};

    if (keyword && keyword.trim()) {
      query.name = { $regex: keyword.trim(),$options: "i" };
    }

    if (category && category.trim()) {
      query.category = { $regex: `^${category.trim()}$`, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) query.price.$gte = Number(minPrice);
      if (maxPrice && !isNaN(Number(maxPrice))) query.price.$lte = Number(maxPrice);
      if (Object.keys(query.price).length === 0) delete query.price;
    }

    let sortCriteria = { createdAt: -1 };
    if (sort === "price_asc") sortCriteria = { price: 1 };
    else if (sort === "price_desc") sortCriteria = { price: -1 };
    else if (sort === "rating") sortCriteria = { ratings: -1 };

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortCriteria)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      products,
      total,
      pages: Math.ceil(total / limitNum) || 1,
      page: pageNum,
    });
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ product });
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found." });
    res.status(200).json({ message: "Product deleted successfully." });
  } catch (err) {
    next(err);
  }
};
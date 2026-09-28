import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    brand: { type: String, default: "General" },
    stock: { type: Number, required: true, default: 0, min: 0 },
    image: { type: String, default: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500" },
    ratings: { type: Number, default: 4.5, min: 0, max: 5 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
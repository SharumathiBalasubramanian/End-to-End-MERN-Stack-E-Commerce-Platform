import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5 },
    image: { type: String, required: true },
    brand: { type: String, default: "Urban Craft" }, // <-- Default added so it doesn't fail
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
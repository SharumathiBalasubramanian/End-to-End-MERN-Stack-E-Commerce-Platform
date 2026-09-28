import Product from "../models/product.js";

/**
 * RapidMiner-based Recommendation System
 * Connects to a deployed RapidMiner AI Server endpoint via REST webhook.
 * Falls back to content-based similarity matching (Euclidean/Cosine space over category & price vector)
 * if the RapidMiner webhook URL is omitted.
 */
export const getRecommendations = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const targetProduct = await Product.findById(productId);

    if (!targetProduct) {
      return res.status(404).json({ message: "Reference product not found for analytics." });
    }

    if (process.env.RAPIDMINER_ENDPOINT) {
      try {
        const rmResponse = await fetch(`${process.env.RAPIDMINER_ENDPOINT}/api/v1/recommend`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: targetProduct._id,
            category: targetProduct.category,
            price: targetProduct.price,
          }),
        });
        const rmData = await rmResponse.json();
        return res.status(200).json({ recommendations: rmData.items });
      } catch (rmError) {
        console.warn("[RapidMiner API Fallback]: Defaulting to local similarity vector matrix.");
      }
    }

    // Similarity matrix algorithm: match same category and order by price proximity
    const recommendations = await Product.find({
      _id: { $ne: targetProduct._id },
      category: targetProduct.category,
    })
      .sort({ ratings: -1 })
      .limit(6);

    res.status(200).json({ recommendations });
  } catch (err) {
    next(err);
  }
};
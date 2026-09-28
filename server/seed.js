import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/urbancraft";

const sampleProducts = [
  {
    name: "Minimalist Ceramic Mug",
    category: "Pottery",
    price: 499,
    description: "Hand-thrown stoneware mug with a tactile matte glaze finish and ergonomic handle.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    countInStock: 25,
  },
  {
    name: "Teak Wood Serving Bowl",
    category: "Woodcraft",
    price: 1299,
    description: "Carved from sustainably harvested reclaimed teak wood, polished with organic beeswax.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    countInStock: 15,
  },
  {
    name: "Terracotta Flower Vase",
    category: "Pottery",
    price: 849,
    description: "Traditional earthen terracotta vase designed for dried florals and modern interior aesthetics.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=700&q=80",
    rating: 4.6,
    countInStock: 30,
  },
  {
    name: "Handwoven Cotton Throw",
    category: "Textiles",
    price: 1599,
    description: "100% organic cotton throw blanket loomed by traditional weavers with textured tassel trims.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    countInStock: 20,
  },
  {
    name: "Raw Brass Incense Burner",
    category: "Home Decor",
    price: 699,
    description: "Solid heavy-gauge brass holder crafted to catch ash effortlessly with understated elegance.",
    image: "https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=700&q=80",
    rating: 4.5,
    countInStock: 40,
  },
  {
    name: "Handcrafted Leather Journal",
    category: "Accessories",
    price: 899,
    description: "Hand-stitched vintage pull-up leather cover with 200 deckle-edge unlined cotton parchment pages.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    countInStock: 35,
  },
  {
    name: "Speckled Stoneware Plate",
    category: "Pottery",
    price: 549,
    description: "Oven and dishwasher safe natural stoneware side plate featuring speckled mineral glaze.",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=700&q=80",
    rating: 4.4,
    countInStock: 50,
  },
  {
    name: "Hand-Carved Walnut Spoon",
    category: "Woodcraft",
    price: 399,
    description: "Smooth oiled American walnut cooking utensil ideal for non-stick cookware and rustic table settings.",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    countInStock: 60,
  },
  {
    name: "Linen Table Runner",
    category: "Textiles",
    price: 1199,
    description: "Pre-washed European flax linen table runner that gets softer with every home wash cycle.",
    image: "https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    countInStock: 18,
  },
  {
    name: "Scented Soy Wax Candle",
    category: "Home Decor",
    price: 649,
    description: "Hand-poured coconut soy candle infused with cedarwood, amber, and vetiver essential oils.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    countInStock: 45,
  },
  {
    name: "Ceramic Pour-Over Dripper",
    category: "Pottery",
    price: 799,
    description: "Conical slow-drip coffee brewer designed for superior thermal retention and clean extraction.",
    image: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    countInStock: 22,
  },
  {
    name: "Braided Jute Planter Basket",
    category: "Home Decor",
    price: 749,
    description: "Biodegradable golden jute fiber indoor plant basket with reinforced braided dual handles.",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=700&q=80",
    rating: 4.6,
    countInStock: 30,
  },
  {
    name: "Olive Wood Cutting Board",
    category: "Woodcraft",
    price: 1799,
    description: "Dense, antibacterial organic olive wood board exhibiting natural organic edge detailing.",
    image: "https://images.unsplash.com/photo-1594998893017-36147cbcae05?auto=format&fit=crop&w=700&q=80",
    rating: 5.0,
    countInStock: 12,
  },
  {
    name: "Indigo Block Print Cushion",
    category: "Textiles",
    price: 699,
    description: "Hand-block printed pillow cover created using natural indigo mud resist dyeing techniques.",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    countInStock: 25,
  },
  {
    name: "Hammered Copper Water Bottle",
    category: "Accessories",
    price: 1149,
    description: "Pure Ayurvedic grade hammered copper bottle with a leakproof silicone-sealed cap.",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    countInStock: 20,
  },
  {
    name: "Handmade Ceramic Ramen Bowl",
    category: "Pottery",
    price: 949,
    description: "Deep handcrafted noodle bowl with dedicated resting slots for chopsticks.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    countInStock: 16,
  },
  {
    name: "Acacia Wood Coaster Set",
    category: "Woodcraft",
    price: 449,
    description: "Set of 4 water-resistant acacia coasters accented with white resin river detailing.",
    image: "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=700&q=80",
    rating: 4.5,
    countInStock: 40,
  },
  {
    name: "Macrame Cotton Wall Hanging",
    category: "Home Decor",
    price: 1399,
    description: "Bohemian geometric wall tapestry knotted from unbleached 4mm twisted cotton cord.",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=700&q=80",
    rating: 4.6,
    countInStock: 14,
  },
  {
    name: "Waffle Weave Bath Towel",
    category: "Textiles",
    price: 899,
    description: "Ultra-absorbent honey-comb waffle woven Turkish cotton bath towel with quick-dry texture.",
    image: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    countInStock: 28,
  },
  {
    name: "Canvas & Leather Tote Bag",
    category: "Accessories",
    price: 1899,
    description: "Heavyweight 16oz waxed canvas everyday tote with bridle leather straps and brass hardware.",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    countInStock: 15,
  },
  {
    name: "Ceramic Matcha Whisk Holder",
    category: "Pottery",
    price: 349,
    description: "Shaped glaze ceramic stand that preserves the delicate curl of your bamboo chasen whisk.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=700&q=80",
    rating: 4.7,
    countInStock: 35,
  },
  {
    name: "Live Edge Floating Shelf",
    category: "Woodcraft",
    price: 2199,
    description: "Solid cedar wood shelf featuring natural raw bark bark-line edges and concealed wall brackets.",
    image: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    countInStock: 10,
  },
  {
    name: "Brass Wick Trimmer & Snuffer",
    category: "Home Decor",
    price: 599,
    description: "Vintage antique gold candle care companion set for smoke-free candle extinguishing.",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=700&q=80",
    rating: 4.4,
    countInStock: 50,
  },
  {
    name: "Hand-Knitted Wool Beanie",
    category: "Accessories",
    price: 799,
    description: "Spun from 100% fine Merino wool to deliver breathable thermal insulation in colder weather.",
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=700&q=80",
    rating: 4.8,
    countInStock: 25,
  },
  {
    name: "Raw Linen Apron",
    category: "Textiles",
    price: 1349,
    description: "Cross-back studio apron constructed with reinforced utility pockets and no neck-strap pressure.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=700&q=80",
    rating: 4.9,
    countInStock: 20,
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Previous product collection cleared.");

    // Insert 25 new products
    await Product.insertMany(sampleProducts);
    console.log("Successfully seeded 25 products!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDatabase();
/**
 * Seed script — run once to populate MongoDB with products + coupons + users
 * Usage: cd backend && node src/db/seed.js
 */
import "dotenv/config";
import mongoose from "mongoose";
import { Product, Coupon, User } from "./models.js";
import bcrypt from "bcryptjs";

await mongoose.connect(process.env.MONGO_URI);
console.log("🍃  Connected");

// ── Clear existing ─────────────────────────────────────────
await Promise.all([Product.deleteMany(), Coupon.deleteMany()]);
console.log("🗑   Cleared products & coupons");

// ── Products ───────────────────────────────────────────────
await Product.insertMany([
  {
    slug: "chilli-lime-baked-chips", name: "Chilli Lime Baked Chips",
    category: "baked-chips", flavour: "Chilli + lime",
    tagline: "Tangy, gently warm, oven-baked crunch.",
    description: "Thin-cut potatoes baked until they snap, then tumbled with red chilli, lime powder and curry leaf.",
    price: 149, mrp: 179, weight: "80g",
    image: "/images/47a054989_generated_5ca565e1.png",
    gallery: ["/images/47a054989_generated_5ca565e1.png"],
    variants: [{ weight: "80g", price: 149, mrp: 179, stock: 42 }, { weight: "160g", price: 269, mrp: 329, stock: 18 }],
    rating: 4.7, reviewCount: 128, badges: ["bestseller"], heat: 2,
    oil: "Cold-pressed sunflower oil",
    ingredients: ["Potato", "Cold-pressed sunflower oil", "Rock salt", "Red chilli", "Lime powder", "Curry leaf"],
    nutrition: [{ label: "Energy", value: "412 kcal" }, { label: "Protein", value: "6.2 g" }, { label: "Carbohydrates", value: "61 g" }, { label: "Total fat", value: "14 g" }],
    allergens: "Packed in a facility that also handles peanuts and tree nuts.",
    shelfLife: "6 months from the date of packing",
  },
  {
    slug: "peri-peri-baked-chips", name: "Mild Peri Peri Baked Chips",
    category: "baked-chips", flavour: "Peri peri, mild",
    tagline: "Smoky, garlicky, just enough heat.",
    description: "Our take on peri peri, built on Kashmiri chilli, garlic and a little vinegar for tang.",
    price: 149, mrp: 179, weight: "80g",
    image: "/images/4eeda5402_generated_d732203d.png",
    gallery: ["/images/4eeda5402_generated_d732203d.png"],
    variants: [{ weight: "80g", price: 149, mrp: 179, stock: 36 }, { weight: "160g", price: 269, mrp: 329, stock: 12 }],
    rating: 4.5, reviewCount: 94, badges: ["new"], heat: 1,
    oil: "Cold-pressed sunflower oil",
    ingredients: ["Potato", "Cold-pressed sunflower oil", "Peri peri spice blend", "Rock salt"],
    nutrition: [{ label: "Energy", value: "405 kcal" }, { label: "Protein", value: "5.8 g" }],
    shelfLife: "6 months from the date of packing",
  },
  {
    slug: "himalayan-salt-air-popped", name: "Himalayan Salt Air-Popped",
    category: "air-popped", flavour: "Plain salted",
    tagline: "Pure. Light. Irresistible.",
    description: "Popped corn in cold-pressed groundnut oil, finished with Himalayan pink salt.",
    price: 129, mrp: 159, weight: "70g",
    image: "/images/0add772b1_generated_b001bff1.png",
    gallery: ["/images/0add772b1_generated_b001bff1.png"],
    variants: [{ weight: "70g", price: 129, mrp: 159, stock: 60 }],
    rating: 4.6, reviewCount: 72, badges: ["bestseller"], heat: 0,
    oil: "Cold-pressed groundnut oil",
    ingredients: ["Corn", "Cold-pressed groundnut oil", "Himalayan pink salt"],
    nutrition: [{ label: "Energy", value: "380 kcal" }, { label: "Protein", value: "9.2 g" }],
    shelfLife: "5 months from the date of packing",
  },
  {
    slug: "ragi-chips", name: "Ragi Chips",
    category: "millets", flavour: "Jeera & black pepper",
    tagline: "Ancient grain. Modern crunch.",
    description: "Finger millet mixed with rice and baked with cumin and black pepper.",
    price: 179, mrp: 219, weight: "85g",
    image: "/images/637d46623_generated_aa5b0232.png",
    gallery: ["/images/637d46623_generated_aa5b0232.png"],
    variants: [{ weight: "85g", price: 179, mrp: 219, stock: 28 }],
    rating: 4.4, reviewCount: 55, badges: [], heat: 1,
    oil: "Cold-pressed sesame oil",
    ingredients: ["Finger millet", "Rice", "Cold-pressed sesame oil", "Cumin", "Black pepper", "Rock salt"],
    nutrition: [{ label: "Energy", value: "390 kcal" }, { label: "Protein", value: "7.8 g" }, { label: "Dietary fibre", value: "8.1 g" }],
    shelfLife: "5 months from the date of packing",
  },
  {
    slug: "khatta-meetha-namkeen", name: "Khatta Meetha Namkeen",
    category: "namkeen", flavour: "Sweet & tangy",
    tagline: "The classic street mix, made clean.",
    description: "A classic Indian sweet-sour-spicy mix: sev, peanuts, raisins, baked boondi.",
    price: 149, mrp: 179, weight: "150g",
    image: "/images/18c0c3458_generated_c291752d.png",
    gallery: ["/images/18c0c3458_generated_c291752d.png"],
    variants: [{ weight: "150g", price: 149, mrp: 179, stock: 45 }, { weight: "300g", price: 279, mrp: 329, stock: 20 }],
    rating: 4.3, reviewCount: 41, badges: [], heat: 1,
    oil: "Cold-pressed groundnut oil",
    ingredients: ["Chickpea flour", "Peanuts", "Raisins", "Sugar", "Rock salt", "Spices"],
    shelfLife: "4 months from the date of packing",
  },
  {
    slug: "hostel-survival-box", name: "Hostel Survival Box",
    category: "bundle", flavour: "Mixed",
    tagline: "Five full-size packs for the ultimate hostel snack stash.",
    description: "Five full-size packs: chilli lime, cream & onion, millet puffs, jowar sev and Mumbai masala.",
    price: 649, mrp: 815, weight: "Box of 5",
    image: "/images/b72b97e1a_generated_413ccab6.png",
    gallery: ["/images/b72b97e1a_generated_413ccab6.png"],
    variants: [{ weight: "Box of 5", price: 649, mrp: 815, stock: 15 }],
    rating: 4.8, reviewCount: 63, badges: ["bestseller", "bundle"],
    oil: "Cold-pressed oils only", heat: 2,
    ingredients: ["Assorted packs"],
    shelfLife: "Varies per pack",
  },
]);

console.log("✅  Products seeded");

// ── Coupons ────────────────────────────────────────────────
await Coupon.insertMany([
  { code: "WELCOME10", type: "percent", value: 10, minOrder: 499, active: true, description: "10% off your first order over ₹499" },
  { code: "CRUNCH50", type: "flat", value: 50, minOrder: 399, active: true, description: "₹50 off orders over ₹399" },
  { code: "HOSTEL15", type: "percent", value: 15, minOrder: 799, active: true, description: "15% off bundle boxes over ₹799" },
  { code: "FREESHIP", type: "shipping", value: 0, minOrder: 0, active: true, description: "Free shipping, any order size" },
]);

console.log("✅  Coupons seeded");

// ── Users ──────────────────────────────────────────────────
const existingAdmin = await User.findOne({ email: "admin@moro.in" });
if (!existingAdmin) {
  await User.create({
    name: "MORO Admin",
    email: "admin@moro.in",
    passwordHash: await bcrypt.hash("MoroAdmin@2024", 12),
    role: "admin",
  });
  console.log("✅  Admin user created → admin@moro.in / MoroAdmin@2024");
}

const existingCustomer = await User.findOne({ email: "aanya.kapoor@example.com" });
if (!existingCustomer) {
  await User.create({
    name: "Aanya Kapoor",
    email: "aanya.kapoor@example.com",
    phone: "9820041123",
    passwordHash: await bcrypt.hash("MOROcrunch", 12),
    role: "customer",
    addresses: [
      {
        label: "Home",
        name: "Aanya Kapoor",
        phone: "9820041123",
        line1: "Flat 402, Green Glen Layout",
        line2: "Bellandur",
        city: "Bengaluru",
        state: "Karnataka",
        pincode: "560103",
      },
    ],
  });
  console.log("✅  Demo customer created → aanya.kapoor@example.com / MOROcrunch");
}

await mongoose.disconnect();
console.log("\n🎉  Seed complete!\n");

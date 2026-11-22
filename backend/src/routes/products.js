import express from "express";
import { Product } from "../db/models.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// GET /api/products — list with filtering, sorting, pagination
router.get("/", async (req, res, next) => {
  try {
    const { category, q = "", sort = "featured", max, inStockOnly, limit = 50, page = 1 } = req.query;

    const filter = { active: true };
    if (category) filter.category = category;
    if (max) filter.price = { $lte: Number(max) };
    if (inStockOnly === "true") filter["variants.0.stock"] = { $gt: 0 };
    if (q.trim()) {
      const re = new RegExp(q.trim(), "i");
      filter.$or = [{ name: re }, { flavour: re }, { tagline: re }, { category: re }];
    }

    const sortMap = {
      featured: {},
      "price-asc": { price: 1 },
      "price-desc": { price: -1 },
      newest: { createdAt: -1 },
      popular: { reviewCount: -1 },
      rating: { rating: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortMap[sort] || {}).skip(skip).limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.json({ ok: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
});

// GET /api/products/bestsellers
router.get("/bestsellers", async (req, res, next) => {
  try {
    const products = await Product.find({ active: true, badges: "bestseller" }).limit(Number(req.query.limit) || 6);
    res.json({ ok: true, products });
  } catch (err) { next(err); }
});

// GET /api/products/bundles — products flagged as bundle category
router.get("/bundles", async (req, res, next) => {
  try {
    const products = await Product.find({ active: true, category: "bundle" });
    res.json({ ok: true, products });
  } catch (err) { next(err); }
});

// GET /api/products/:slug
router.get("/:slug", async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, active: true });
    if (!product) return res.status(404).json({ ok: false, message: "Product not found" });
    res.json({ ok: true, product });
  } catch (err) { next(err); }
});

// ── Admin CRUD ──────────────────────────────────────────────

// POST /api/products
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ ok: true, product });
  } catch (err) { next(err); }
});

// PATCH /api/products/:id
router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ ok: false, message: "Product not found" });
    res.json({ ok: true, product });
  } catch (err) { next(err); }
});

// DELETE /api/products/:id — soft delete
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ ok: true, message: "Product deactivated" });
  } catch (err) { next(err); }
});

export default router;

import express from "express";
import { User, Order, Product, Coupon, Subscriber } from "../db/models.js";
import { requireAdmin } from "../middleware/auth.js";
import { notifyMarketingCampaign } from "../services/notifications.js";

const router = express.Router();

// All admin routes require admin JWT
router.use(requireAdmin);

// GET /api/admin/stats — dashboard KPIs
router.get("/stats", async (_req, res, next) => {
  try {
    const [totalOrders, totalCustomers, totalProducts, revenue, recentOrders] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      Product.countDocuments({ active: true }),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.find().sort({ placedAt: -1 }).limit(5),
    ]);
    res.json({
      ok: true,
      stats: {
        totalOrders,
        totalCustomers,
        totalProducts,
        revenue: revenue[0]?.total || 0,
      },
      recentOrders,
    });
  } catch (err) { next(err); }
});

// GET /api/admin/customers
router.get("/customers", async (req, res, next) => {
  try {
    const { page = 1, limit = 30, q } = req.query;
    const filter = { role: "customer" };
    if (q) { const re = new RegExp(q, "i"); filter.$or = [{ name: re }, { email: re }]; }
    const skip = (Number(page) - 1) * Number(limit);
    const [customers, total] = await Promise.all([
      User.find(filter).select("-passwordHash -refreshTokens -resetToken").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ ok: true, customers, total });
  } catch (err) { next(err); }
});

// PATCH /api/admin/products/:id/stock — bulk stock update
router.patch("/products/:id/stock", async (req, res, next) => {
  try {
    const { variantIndex, stock } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ ok: false, message: "Product not found" });
    if (product.variants[variantIndex] !== undefined) {
      product.variants[variantIndex].stock = Number(stock);
      await product.save();
    }
    res.json({ ok: true, product });
  } catch (err) { next(err); }
});

// POST /api/admin/broadcast — send marketing email & WhatsApp campaign
router.post("/broadcast", async (req, res, next) => {
  try {
    const { title, message, discountCode, discountDetails, ctaUrl, channels } = req.body;
    if (!title || !message) {
      return res.status(400).json({ ok: false, message: "Title and message are required" });
    }

    const campaignResult = await notifyMarketingCampaign({
      title,
      message,
      discountCode,
      discountDetails,
      ctaUrl: ctaUrl || "http://localhost:5173/shop",
      channels: channels || ["email", "whatsapp"],
    });

    res.json({
      ok: true,
      message: `Broadcast initiated successfully across ${campaignResult.channels.join(" & ")}.`,
      data: campaignResult,
    });
  } catch (err) { next(err); }
});

// GET /api/admin/audience — get customer & subscriber audience counts
router.get("/audience", async (_req, res, next) => {
  try {
    const [customerCount, subscriberCount, subscribers] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      Subscriber.countDocuments({ active: true }),
      Subscriber.find({ active: true }).sort({ subscribedAt: -1 }).limit(50),
    ]);
    res.json({
      ok: true,
      customerCount,
      subscriberCount,
      totalAudience: customerCount + subscriberCount,
      recentSubscribers: subscribers,
    });
  } catch (err) { next(err); }
});

export default router;

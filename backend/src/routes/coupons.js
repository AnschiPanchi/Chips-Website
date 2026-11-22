import express from "express";
import { Coupon } from "../db/models.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// POST /api/coupons/validate — check if a coupon is valid
router.post("/validate", async (req, res, next) => {
  try {
    const { code, subtotal = 0 } = req.body;
    if (!code) return res.status(400).json({ ok: false, message: "Coupon code required" });

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });

    if (!coupon || !coupon.active)
      return res.status(404).json({ ok: false, message: "That code isn't valid right now." });

    if (coupon.expiresAt && new Date() > coupon.expiresAt)
      return res.status(400).json({ ok: false, message: "This coupon has expired." });

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
      return res.status(400).json({ ok: false, message: "This coupon has reached its usage limit." });

    if (coupon.minOrder && subtotal < coupon.minOrder)
      return res.status(400).json({
        ok: false,
        message: `Add ₹${coupon.minOrder - subtotal} more to use ${coupon.code}.`,
      });

    res.json({ ok: true, coupon: {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minOrder: coupon.minOrder,
      description: coupon.description,
    }});
  } catch (err) { next(err); }
});

// Admin: GET all coupons
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ ok: true, coupons });
  } catch (err) { next(err); }
});

// Admin: POST — create coupon
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ ok: true, coupon });
  } catch (err) { next(err); }
});

// Admin: PATCH — update coupon
router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ ok: false, message: "Coupon not found" });
    res.json({ ok: true, coupon });
  } catch (err) { next(err); }
});

// Admin: DELETE
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ ok: true, message: "Coupon deleted" });
  } catch (err) { next(err); }
});

export default router;

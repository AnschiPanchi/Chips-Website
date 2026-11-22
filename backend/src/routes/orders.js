import express from "express";
import mongoose from "mongoose";
import { Order } from "../db/models.js";
import { requireAuth, requireAdmin, optionalAuth } from "../middleware/auth.js";
import {
  notifyOrderStatusChange,
  notifyOrderPlaced,
  generateWhatsAppLink,
  getOrderStatusWhatsApp,
  getOrderPlacedWhatsApp,
} from "../services/notifications.js";

const router = express.Router();

function getOrderLookup(param) {
  return mongoose.isValidObjectId(param)
    ? { $or: [{ _id: param }, { orderNumber: param }] }
    : { orderNumber: param };
}

// GET /api/orders/my — current user's orders
router.get("/my", requireAuth, async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ placedAt: -1 });
    const formatted = orders.map((o) => ({
      ...o.toObject(),
      id: o.orderNumber,
      payment: o.paymentMethod === "cod" ? "Cash on delivery (COD)" : "Online (Razorpay)",
    }));
    res.json({ ok: true, orders: formatted });
  } catch (err) { next(err); }
});

// GET /api/orders/:orderNumber — single order (with optional auth so guest checkouts can view confirmation)
router.get("/:orderNumber", optionalAuth, async (req, res, next) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber });
    if (!order) return res.status(404).json({ ok: false, message: "Order not found" });

    const formatted = {
      ...order.toObject(),
      id: order.orderNumber,
      payment: order.paymentMethod === "cod" ? "Cash on delivery (COD)" : "Online (Razorpay)",
    };
    res.json({ ok: true, order: formatted });
  } catch (err) { next(err); }
});

// Admin: GET /api/orders — all orders with pagination
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const { page = 1, limit = 30, status, q } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) {
      const re = new RegExp(q, "i");
      filter.$or = [{ orderNumber: re }, { customer: re }, { email: re }];
    }
    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ placedAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);
    const formatted = orders.map((o) => ({
      ...o.toObject(),
      id: o.orderNumber,
      payment: o.paymentMethod === "cod" ? "Cash on delivery (COD)" : "Online (Razorpay)",
    }));
    res.json({ ok: true, orders: formatted, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (err) { next(err); }
});

// Admin: PATCH /api/orders/:id/status
router.patch("/:id/status", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["placed", "packed", "shipped", "out-for-delivery", "delivered", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ ok: false, message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      getOrderLookup(req.params.id),
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ ok: false, message: "Order not found" });

    // Send notifications non-blocking via email and whatsapp
    notifyOrderStatusChange(order, status).catch((e) =>
      console.error("Status notification error:", e.message)
    );

    const phone = order.phone || order.address?.phone;
    const waUrl = phone
      ? generateWhatsAppLink(phone, getOrderStatusWhatsApp(order, status))
      : null;

    res.json({
      ok: true,
      order: {
        ...order.toObject(),
        id: order.orderNumber,
      },
      waUrl,
      message: `Status updated to ${status}. Notification dispatched.`,
    });
  } catch (err) { next(err); }
});

// Admin: POST /api/orders/:id/notify — resend notification or get live WhatsApp link
router.post("/:id/notify", requireAdmin, async (req, res, next) => {
  try {
    const { type = "status" } = req.body; // "status" or "placed"
    const order = await Order.findOne(getOrderLookup(req.params.id));
    if (!order) return res.status(404).json({ ok: false, message: "Order not found" });

    let notifyResult;
    let messageText = "";

    if (type === "placed") {
      notifyResult = await notifyOrderPlaced(order);
      messageText = getOrderPlacedWhatsApp(order);
    } else {
      notifyResult = await notifyOrderStatusChange(order, order.status);
      messageText = getOrderStatusWhatsApp(order, order.status);
    }

    const phone = order.phone || order.address?.phone;
    const waUrl = phone ? generateWhatsAppLink(phone, messageText) : null;

    res.json({
      ok: true,
      orderId: order.orderNumber,
      status: order.status,
      waUrl,
      result: notifyResult,
    });
  } catch (err) { next(err); }
});

export default router;

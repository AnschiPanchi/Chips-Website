import Razorpay from "razorpay";
import crypto from "crypto";
import express from "express";
import { Order } from "../db/models.js";
import { requireAuth, optionalAuth } from "../middleware/auth.js";
import { notifyOrderPlaced } from "../services/notifications.js";

const router = express.Router();

const rzp = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/create-order
// Called BEFORE showing Razorpay checkout — creates a Razorpay order and our DB order
router.post("/create-order", optionalAuth, async (req, res, next) => {
  try {
    const { items, address, delivery, couponCode, subtotal, discount, shipping, total, email, phone, name } = req.body;

    if (!items?.length) return res.status(400).json({ ok: false, message: "Cart is empty" });
    if (!address || !email || !name) return res.status(400).json({ ok: false, message: "Contact & address required" });

    // Create Razorpay order (amount in paise)
    const rzpOrder = await rzp.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `moro_${Date.now()}`,
      notes: { email, name },
    });

    // Generate our order number
    const orderNumber = `MRO-${10000 + Math.floor(Math.random() * 90000)}`;

    // Save order in DB as pending
    const order = await Order.create({
      orderNumber,
      userId: req.userId || null,
      guestEmail: req.userId ? undefined : email,
      customer: name,
      email,
      phone,
      items,
      subtotal,
      discount: discount || 0,
      shipping: shipping || 0,
      total,
      couponCode: couponCode || undefined,
      address,
      delivery: delivery || "standard",
      paymentMethod: "razorpay",
      paymentStatus: "pending",
      razorpayOrderId: rzpOrder.id,
    });

    res.json({
      ok: true,
      orderId: rzpOrder.id,       // Razorpay order ID → passed to checkout.js
      orderNumber,                 // Our internal ID
      dbOrderId: order._id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) { next(err); }
});

// POST /api/payments/verify
// Called by frontend AFTER Razorpay success callback — verifies signature
router.post("/verify", optionalAuth, async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = req.body;

    // Verify HMAC signature
    const expectedSig = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: "failed" }
      );
      return res.status(400).json({ ok: false, message: "Payment verification failed" });
    }

    // Update order to paid
    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        paymentStatus: "paid",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "placed",
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ ok: false, message: "Order not found" });

    // Send confirmation email and WhatsApp alert (non-blocking)
    notifyOrderPlaced(order).catch(e => console.error("Notification error:", e.message));

    res.json({ ok: true, orderNumber: order.orderNumber, message: "Payment verified" });
  } catch (err) { next(err); }
});

// POST /api/payments/cod — Cash on Delivery order (no Razorpay)
router.post("/cod", optionalAuth, async (req, res, next) => {
  try {
    const { items, address, delivery, couponCode, subtotal, discount, shipping, total, email, phone, name } = req.body;

    if (!items?.length) return res.status(400).json({ ok: false, message: "Cart is empty" });
    if (!address || !email || !name) return res.status(400).json({ ok: false, message: "Contact & address required" });

    const orderNumber = `MRO-${10000 + Math.floor(Math.random() * 90000)}`;

    const order = await Order.create({
      orderNumber,
      userId: req.userId || null,
      guestEmail: req.userId ? undefined : email,
      customer: name,
      email,
      phone,
      items,
      subtotal,
      discount: discount || 0,
      shipping: shipping || 0,
      total,
      couponCode: couponCode || undefined,
      address,
      delivery: delivery || "standard",
      paymentMethod: "cod",
      paymentStatus: "pending",
      status: "placed",
    });

    // Send confirmation email and WhatsApp alert (non-blocking)
    notifyOrderPlaced(order).catch(e => console.error("Notification error:", e.message));

    res.status(201).json({ ok: true, orderNumber: order.orderNumber });
  } catch (err) { next(err); }
});

// GET /api/payments/key — returns public key to frontend
router.get("/key", (_req, res) =>
  res.json({ ok: true, keyId: process.env.RAZORPAY_KEY_ID })
);

export default router;

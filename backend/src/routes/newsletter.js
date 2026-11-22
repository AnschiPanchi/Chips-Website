import express from "express";
import { Subscriber } from "../db/models.js";
import { requireAdmin } from "../middleware/auth.js";
import { sendWelcomeNewsletterEmail } from "../services/mailer.js";
import { sendWhatsAppMessage } from "../services/whatsapp.js";

const router = express.Router();

// POST /api/newsletter/subscribe — public signup with welcome email + code WELCOME10
router.post("/subscribe", async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      return res.status(400).json({ ok: false, message: "Valid email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const subscriber = await Subscriber.findOneAndUpdate(
      { email: cleanEmail },
      { $set: { active: true, ...(phone && { phone: phone.trim() }), subscribedAt: new Date() } },
      { upsert: true, new: true }
    );

    // Send welcome email with WELCOME10 non-blocking
    sendWelcomeNewsletterEmail(cleanEmail).catch((e) =>
      console.error("Welcome email error:", e.message)
    );

    // If phone provided, send WhatsApp welcome
    if (subscriber.phone) {
      const waMsg = `🎉 *Welcome to MORO Snacks Crunch Club!*

Thanks for joining our inner circle. We bake fresh snacks with cold-pressed oils and zero palm oil.

🎁 Here is your exclusive 10% OFF coupon code:
*WELCOME10* (Min. order ₹499)

Shop your favourites now:
👉 http://localhost:5173/shop

Crunch on! 🌿`;

      sendWhatsAppMessage({
        phone: subscriber.phone,
        message: waMsg,
        customerName: "Snack Lover",
      }).catch((e) => console.error("WhatsApp welcome error:", e.message));
    }

    res.json({
      ok: true,
      message: "You're in! Check your inbox for coupon code WELCOME10.",
      subscriber: { email: subscriber.email, subscribedAt: subscriber.subscribedAt },
    });
  } catch (err) {
    next(err);
  }
});

// Admin: GET /api/newsletter/subscribers
router.get("/subscribers", requireAdmin, async (_req, res, next) => {
  try {
    const subscribers = await Subscriber.find({ active: true }).sort({ subscribedAt: -1 });
    res.json({ ok: true, subscribers, count: subscribers.length });
  } catch (err) {
    next(err);
  }
});

export default router;

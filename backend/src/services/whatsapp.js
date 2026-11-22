/**
 * WhatsApp Notification Service for MORO Snacks
 *
 * Supports:
 * 1. Twilio WhatsApp API (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM)
 * 2. Meta WhatsApp Cloud API (WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID)
 * 3. Fallback: Formats phone numbers, generates live wa.me URLs, and logs to terminal
 */

function cleanPhone(raw) {
  if (!raw) return "";
  let digits = String(raw).replace(/\D/g, "");
  // If 10 digits (standard India mobile), prefix with country code 91
  if (digits.length === 10) digits = "91" + digits;
  // If starts with 0 and is 11 digits
  if (digits.length === 11 && digits.startsWith("0")) digits = "91" + digits.slice(1);
  return digits;
}

export function generateWhatsAppLink(phone, message) {
  const cleaned = cleanPhone(phone);
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

/**
 * Send WhatsApp message via configured provider or log with click-to-chat URL
 */
export async function sendWhatsAppMessage({ phone, message, customerName }) {
  const recipient = cleanPhone(phone);
  if (!recipient) {
    console.warn("[WhatsApp] No valid phone number provided for message:", customerName);
    return { ok: false, message: "Invalid phone number" };
  }

  const waUrl = generateWhatsAppLink(recipient, message);

  // 1. Twilio Provider
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM) {
    try {
      const auth = Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64");
      const from = process.env.TWILIO_WHATSAPP_FROM.startsWith("whatsapp:")
        ? process.env.TWILIO_WHATSAPP_FROM
        : `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`;
      const to = `whatsapp:+${recipient}`;

      const params = new URLSearchParams();
      params.append("From", from);
      params.append("To", to);
      params.append("Body", message);

      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: params.toString(),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Twilio error");

      console.log(`📱 [WhatsApp:Twilio] Message delivered to +${recipient} (SID: ${data.sid})`);
      return { ok: true, provider: "twilio", sid: data.sid, waUrl };
    } catch (err) {
      console.error("❌ [WhatsApp:Twilio Error]", err.message);
    }
  }

  // 2. Meta WhatsApp Cloud API Provider
  if (process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/v21.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: recipient,
            type: "text",
            text: { body: message },
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Meta WhatsApp error");

      console.log(`📱 [WhatsApp:CloudAPI] Message delivered to +${recipient}`);
      return { ok: true, provider: "meta", data, waUrl };
    } catch (err) {
      console.error("❌ [WhatsApp:CloudAPI Error]", err.message);
    }
  }

  // 3. Fallback / Dev Mode: Log message and active wa.me link
  console.log(`\n📱 ─────────── [WHATSAPP DISPATCH] ───────────`);
  console.log(`To: +${recipient} (${customerName || "Customer"})`);
  console.log(`Message:\n${message}`);
  console.log(`🔗 Click-to-Chat Link: ${waUrl}`);
  console.log(`──────────────────────────────────────────────\n`);

  return { ok: true, provider: "dev_simulator", waUrl, message };
}

// ── Templates ───────────────────────────────────────────────

export function getOrderPlacedWhatsApp(order) {
  const itemsText = order.items
    ?.map((i) => `• ${i.name} (${i.weight || "pack"}) × ${i.qty}`)
    .join("\n") || "• Assorted MORO packs";

  const paymentText = order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online (Razorpay)";

  return `🎉 *Order Confirmed — MORO Snacks*

Hi ${order.customer || "there"}! Thanks for picking MORO! Your order has been placed successfully.

📦 *Order ID:* ${order.orderNumber}
💰 *Total Amount:* ₹${order.total} (${paymentText})
🚚 *Delivery:* ${order.delivery === "express" ? "Express (1–2 days)" : "Standard (5–7 days)"}

*Items:*
${itemsText}

📍 *Shipping to:*
${order.address?.name || order.customer}, ${order.address?.city || ""} - ${order.address?.pincode || ""}

We're freshly baking and packing your snacks! We'll notify you as soon as they're dispatched.

Track your order anytime:
👉 http://localhost:5173/account/orders/${order.orderNumber}

Crunch on! 🌿 Zero palm oil. Always.`;
}

export function getOrderStatusWhatsApp(order, newStatus) {
  const statusEmojis = {
    packed: "📦",
    shipped: "🚚",
    "out-for-delivery": "🛵",
    delivered: "✅",
    cancelled: "❌",
  };

  const statusTitles = {
    packed: "Your order is Packed & Ready!",
    shipped: "Your order has been Shipped!",
    "out-for-delivery": "Out for Delivery Today!",
    delivered: "Delivered! Enjoy your snacks!",
    cancelled: "Order Cancelled",
  };

  const statusNotes = {
    packed: "Freshly packed and handed over to our dispatch hub.",
    shipped: "On its way with our delivery partner! Expected in 2–4 days.",
    "out-for-delivery": "Our delivery agent is nearby. Please keep your phone reachable.",
    delivered: "We hope you enjoy every crunchy, palm-oil-free bite! Leave us a review on the site.",
    cancelled: "Your order has been cancelled. If any refund is due, it will reflect in 3–5 working days.",
  };

  const emoji = statusEmojis[newStatus] || "🔔";
  const title = statusTitles[newStatus] || `Order Status: ${newStatus}`;
  const note = statusNotes[newStatus] || "Your order status has been updated.";

  return `${emoji} *${title} — MORO Snacks*

Hi ${order.customer || "there"},

Here is an update on your order *${order.orderNumber}*:

📌 *Status:* ${newStatus.toUpperCase()}
📝 *Note:* ${note}

Track live details:
👉 http://localhost:5173/account/orders/${order.orderNumber}

Questions? Reply directly to this message or write to hello@moro.in.`;
}

export function getPromoSaleWhatsApp({ name, title, discountCode, discountDetails, message, shopUrl }) {
  return `🔥 *FLASH SALE — MORO Snacks* 🔥

Hi ${name || "snack lover"}!

${title || "Special Treat Just for You!"}
${message || "Craving something savoury, spicy, and baked with zero palm oil?"}

🎁 *Use Code:* *${discountCode || "CRUNCH50"}*
💰 *Offer:* ${discountDetails || "Exclusive Discount on your order"}

Shop your favourite chips, puffs and namkeen before stock runs out:
👉 ${shopUrl || "http://localhost:5173/shop"}

Hurry, offer valid for a limited time! 🏃💨`;
}

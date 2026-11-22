import {
  sendOrderConfirmation,
  sendOrderStatusEmail,
  sendPromoEmail,
  sendWelcomeNewsletterEmail,
  getClientUrl,
} from "./mailer.js";
import {
  sendWhatsAppMessage,
  getOrderPlacedWhatsApp,
  getOrderStatusWhatsApp,
  getPromoSaleWhatsApp,
  generateWhatsAppLink,
} from "./whatsapp.js";
import { User, Subscriber } from "../db/models.js";

/**
 * 1. Order Placed Notification (Email + WhatsApp)
 */
export async function notifyOrderPlaced(order) {
  const results = { email: null, whatsapp: null };
  const phone = order.phone || order.address?.phone;

  // Dispatch Email
  try {
    results.email = await sendOrderConfirmation(order);
  } catch (err) {
    console.error(`❌ [Notification:Email:OrderPlaced] Error:`, err.message);
    results.email = { ok: false, error: err.message };
  }

  // Dispatch WhatsApp
  if (phone) {
    try {
      const message = getOrderPlacedWhatsApp(order);
      results.whatsapp = await sendWhatsAppMessage({
        phone,
        message,
        customerName: order.customer,
      });
    } catch (err) {
      console.error(`❌ [Notification:WhatsApp:OrderPlaced] Error:`, err.message);
      results.whatsapp = { ok: false, error: err.message };
    }
  } else {
    results.whatsapp = { ok: false, message: "No phone number available on order" };
  }

  // Optional: Dispatch alert to Store Admin if ADMIN_NOTIFICATION_PHONE is configured
  if (process.env.ADMIN_NOTIFICATION_PHONE) {
    try {
      const itemsText = order.items?.map((i) => `${i.name} (x${i.qty})`).join(", ") || "Snacks";
      const adminMsg = `🚨 *NEW ORDER RECEIVED — MORO Snacks*\n\nOrder: *${order.orderNumber}*\nCustomer: ${order.customer} (${phone || "no phone"})\nTotal: ₹${order.total} (${order.paymentMethod?.toUpperCase() || "COD"})\nItems: ${itemsText}\nCity: ${order.address?.city || ""}\n\nView details in Admin:\n${getClientUrl()}/admin/orders/${order.orderNumber}`;

      sendWhatsAppMessage({
        phone: process.env.ADMIN_NOTIFICATION_PHONE,
        message: adminMsg,
        customerName: "Store Admin",
      }).catch((e) => console.warn("Admin WhatsApp alert error:", e.message));
    } catch (e) {
      console.warn("Could not send admin WhatsApp notification:", e.message);
    }
  }

  return results;
}

/**
 * 2. Order Status Update Notification (Email + WhatsApp)
 * Triggers when admin updates status: packed, shipped, out-for-delivery, delivered, cancelled
 */
export async function notifyOrderStatusChange(order, newStatus) {
  const results = { email: null, whatsapp: null };
  const phone = order.phone || order.address?.phone;

  // Dispatch Email
  try {
    results.email = await sendOrderStatusEmail(order, newStatus);
  } catch (err) {
    console.error(`❌ [Notification:Email:StatusChange] Error:`, err.message);
    results.email = { ok: false, error: err.message };
  }

  // Dispatch WhatsApp
  if (phone) {
    try {
      const message = getOrderStatusWhatsApp(order, newStatus);
      results.whatsapp = await sendWhatsAppMessage({
        phone,
        message,
        customerName: order.customer,
      });
    } catch (err) {
      console.error(`❌ [Notification:WhatsApp:StatusChange] Error:`, err.message);
      results.whatsapp = { ok: false, error: err.message };
    }
  } else {
    results.whatsapp = { ok: false, message: "No phone number available on order" };
  }

  return results;
}

/**
 * 3. Marketing Campaign / Promotional Broadcast (Email + WhatsApp)
 * Dispatches to registered customers and active newsletter subscribers
 */
export async function notifyMarketingCampaign({
  title,
  message,
  discountCode,
  discountDetails,
  ctaUrl,
  channels = ["email", "whatsapp"],
}) {
  const targetCtaUrl = ctaUrl || `${getClientUrl()}/shop`;
  // Fetch recipient contacts
  const [customers, subscribers] = await Promise.all([
    User.find({ role: "customer" }).select("name email phone"),
    Subscriber.find({ active: true }).select("email phone"),
  ]);

  // Aggregate emails (case-insensitive deduplication)
  const emailMap = new Map();
  customers.forEach((c) => {
    if (c.email) emailMap.set(c.email.toLowerCase(), { name: c.name, email: c.email });
  });
  subscribers.forEach((s) => {
    if (s.email && !emailMap.has(s.email.toLowerCase())) {
      emailMap.set(s.email.toLowerCase(), { name: "Snack Lover", email: s.email });
    }
  });

  // Aggregate phones
  const phoneMap = new Map();
  customers.forEach((c) => {
    if (c.phone) phoneMap.set(c.phone, { name: c.name, phone: c.phone });
  });
  subscribers.forEach((s) => {
    if (s.phone && !phoneMap.has(s.phone)) {
      phoneMap.set(s.phone, { name: "Snack Lover", phone: s.phone });
    }
  });

  const emailList = Array.from(emailMap.values());
  const phoneList = Array.from(phoneMap.values());

  const response = {
    ok: true,
    channels,
    targetSummary: {
      emailsCount: emailList.length,
      phonesCount: phoneList.length,
    },
    results: {
      email: null,
      whatsapp: [],
    },
  };

  // Dispatch Email Broadcast
  if (channels.includes("email") && emailList.length > 0) {
    try {
      response.results.email = await sendPromoEmail({
        subject: `${title} — MORO Snacks`,
        title,
        message,
        discountCode,
        discountDetails,
        ctaUrl: targetCtaUrl,
        recipients: emailList.map((e) => e.email),
      });
    } catch (err) {
      console.error("❌ [Notification:Broadcast:Email Error]", err.message);
      response.results.email = { ok: false, error: err.message };
    }
  }

  // Dispatch WhatsApp Broadcast
  if (channels.includes("whatsapp") && phoneList.length > 0) {
    for (const recipient of phoneList) {
      try {
        const msg = getPromoSaleWhatsApp({
          name: recipient.name,
          title,
          discountCode,
          discountDetails,
          message,
          shopUrl: targetCtaUrl,
        });
        const res = await sendWhatsAppMessage({
          phone: recipient.phone,
          message: msg,
          customerName: recipient.name,
        });
        response.results.whatsapp.push({ phone: recipient.phone, ...res });
      } catch (err) {
        response.results.whatsapp.push({
          phone: recipient.phone,
          ok: false,
          error: err.message,
        });
      }
    }
  }

  console.log(
    `📢 [Broadcast Complete] Title: "${title}" | Emails: ${emailList.length} | WhatsApp: ${phoneList.length}`
  );

  return response;
}

export {
  sendWelcomeNewsletterEmail,
  generateWhatsAppLink,
  getOrderPlacedWhatsApp,
  getOrderStatusWhatsApp,
  getPromoSaleWhatsApp,
};

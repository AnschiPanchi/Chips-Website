import nodemailer from "nodemailer";

let transporter;

function getTransporter() {
  if (!transporter) {
    const isGmail =
      (process.env.SMTP_HOST || "").includes("gmail") ||
      (process.env.SMTP_USER || "").includes("@gmail.com");

    const pass = process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, "") : "";

    transporter = isGmail
      ? nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.SMTP_USER,
            pass,
          },
        })
      : nodemailer.createTransport({
          host: process.env.SMTP_HOST || "smtp.gmail.com",
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass,
          },
        });
  }
  return transporter;
}

function getFromAddress() {
  if (process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes("no-reply@moro.in")) {
    return process.env.EMAIL_FROM;
  }
  return `MORO Snacks <${process.env.SMTP_USER || "hello@moro.in"}>`;
}

const headerHtml = `
  <div style="background:#173F32;padding:28px 32px;border-radius:12px 12px 0 0;text-align:center">
    <h1 style="margin:0;color:#FAF6EC;font-size:26px;letter-spacing:0.25em;font-weight:800">MORO</h1>
    <p style="margin:6px 0 0;color:#FAF6EC;opacity:.7;font-size:12px;letter-spacing:0.1em;text-transform:uppercase">Big Flavour. Zero Palm Oil.</p>
  </div>
`;

const footerHtml = `
  <div style="margin-top:32px;padding-top:20px;border-top:1px solid #e5dfd2;font-size:12px;color:#777;text-align:center">
    <p style="margin:0 0 6px">Made in Bengaluru · Cold-pressed oils · Never palm-oil fried</p>
    <p style="margin:0">Questions? Reply directly to this email or write to <a href="mailto:hello@moro.in" style="color:#E87536;text-decoration:none">hello@moro.in</a></p>
  </div>
`;

/**
 * 1. Order Confirmation Email
 */
export async function sendOrderConfirmation(order) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Mailer] SMTP unset — logging confirmation to ${order.email} (Order ${order.orderNumber})`);
    return { ok: true, channel: "email_dev_mode" };
  }

  const itemRows = order.items
    .map(i => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e3d8;color:#173F32;font-weight:600">${i.name} <span style="color:#7a8a7f;font-weight:400">(${i.weight || "pack"})</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e3d8;text-align:center;color:#173F32">${i.qty}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e8e3d8;text-align:right;color:#173F32;font-weight:600">₹${i.price * i.qty}</td>
      </tr>`)
    .join("");

  const paymentText = order.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online (Razorpay)";

  const html = `
    <div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:580px;margin:20px auto;color:#173F32;line-height:1.5">
      ${headerHtml}
      <div style="background:#FAF6EC;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e8e3d8;border-top:none">
        <h2 style="margin:0 0 4px;font-size:22px;color:#173F32">Order confirmed! 🎉</h2>
        <p style="color:#555;margin:0 0 24px;font-size:14px">Hi ${order.customer}, thanks for your order. We're freshly packing your snacks!</p>

        <div style="background:#fff;border-radius:10px;padding:16px 20px;margin-bottom:24px;border:1px solid #e8e3d8">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#8A945B;font-weight:700">Order Number</p>
          <p style="margin:4px 0 0;font-size:22px;font-weight:800;color:#173F32">${order.orderNumber}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e8e3d8">
          <thead>
            <tr style="background:#f2ede3">
              <th style="padding:10px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#555">Snack</th>
              <th style="padding:10px 12px;text-align:center;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#555">Qty</th>
              <th style="padding:10px 12px;text-align:right;font-size:11px;text-transform:uppercase;letter-spacing:0.1em;color:#555">Total</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="background:#fff;border-radius:10px;padding:16px 20px;margin-bottom:24px;border:1px solid #e8e3d8">
          <table style="width:100%;font-size:13.5px">
            <tr><td style="padding:4px 0;color:#666">Subtotal</td><td style="text-align:right;font-weight:600">₹${order.subtotal}</td></tr>
            ${order.discount > 0 ? `<tr><td style="padding:4px 0;color:#E87536">Discount Applied</td><td style="text-align:right;color:#E87536;font-weight:600">−₹${order.discount}</td></tr>` : ""}
            <tr><td style="padding:4px 0;color:#666">Shipping</td><td style="text-align:right;font-weight:600">${order.shipping === 0 ? "FREE" : "₹" + order.shipping}</td></tr>
            <tr><td style="padding:4px 0;color:#666">Payment Mode</td><td style="text-align:right;font-weight:600">${paymentText}</td></tr>
            <tr style="font-weight:800;font-size:17px">
              <td style="padding-top:10px;border-top:2px solid #173F32;color:#173F32">Total Paid</td>
              <td style="text-align:right;padding-top:10px;border-top:2px solid #173F32;color:#173F32">₹${order.total}</td>
            </tr>
          </table>
        </div>

        <div style="background:#fff;border-radius:10px;padding:16px 20px;margin-bottom:24px;border:1px solid #e8e3d8">
          <p style="margin:0 0 6px;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#8A945B;font-weight:700">Delivering To</p>
          <p style="margin:0;font-size:13.5px;color:#333;line-height:1.6">
            <strong>${order.address?.name || order.customer}</strong> (${order.phone})<br>
            ${order.address?.line1}${order.address?.line2 ? ", " + order.address.line2 : ""}<br>
            ${order.address?.city}, ${order.address?.state} − ${order.address?.pincode}
          </p>
        </div>

        <div style="text-align:center;margin-top:28px">
          <a href="http://localhost:5173/account/orders/${order.orderNumber}" style="display:inline-block;background:#173F32;color:#FAF6EC;padding:14px 28px;border-radius:8px;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;text-decoration:none">Track Your Order</a>
        </div>

        ${footerHtml}
      </div>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: getFromAddress(),
      to: order.email,
      subject: `Order Confirmed: ${order.orderNumber} — MORO Snacks`,
      html,
    });
    console.log(`📧 [Mailer] Confirmation sent to ${order.email}`);
    return { ok: true, channel: "smtp" };
  } catch (err) {
    console.warn(`📧 [Mailer:DevFallback] (${err.code || err.message}) Confirmation logged for ${order.email} (Order ${order.orderNumber})`);
    return { ok: true, channel: "dev_fallback", note: "SMTP auth failed, simulated in console" };
  }
}

/**
 * 2. Order Status Update Email (Packed, Shipped, Out for Delivery, Delivered)
 */
export async function sendOrderStatusEmail(order, newStatus) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Mailer] SMTP unset — logging status update to ${order.email}: ${newStatus}`);
    return { ok: true, channel: "email_dev_mode" };
  }

  const statusDescriptions = {
    packed: "Your snacks have been carefully baked, inspected, and packed fresh in our kitchen.",
    shipped: "Your parcel is on the road! Our logistics partner has picked it up and is heading your way.",
    "out-for-delivery": "Your order is with the delivery executive right now. Keep your phone handy!",
    delivered: "Your package has been delivered! Crack open a pack and experience the uncompromised crunch.",
    cancelled: "Your order has been cancelled. Any refund has been initiated to your original payment method.",
  };

  const statusSubject = {
    packed: `Order ${order.orderNumber} is Packed & Ready!`,
    shipped: `Order ${order.orderNumber} has been Shipped 🚚`,
    "out-for-delivery": `Order ${order.orderNumber} is Out for Delivery Today! 🛵`,
    delivered: `Delivered: Order ${order.orderNumber} 🎉`,
    cancelled: `Order ${order.orderNumber} Cancelled`,
  };

  const html = `
    <div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:580px;margin:20px auto;color:#173F32;line-height:1.5">
      ${headerHtml}
      <div style="background:#FAF6EC;padding:32px;border-radius:0 0 12px 12px;border:1px solid #e8e3d8;border-top:none">
        <span style="display:inline-block;background:#8A945B;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.12em;padding:4px 12px;border-radius:999px;margin-bottom:12px">
          ${newStatus.toUpperCase()}
        </span>
        <h2 style="margin:0 0 6px;font-size:22px;color:#173F32">${statusSubject[newStatus] || "Order Status Update"}</h2>
        <p style="color:#555;margin:0 0 24px;font-size:14px">Hi ${order.customer},</p>
        <p style="color:#333;font-size:15px;line-height:1.6;margin:0 0 24px">${statusDescriptions[newStatus] || "Your order status has changed."}</p>

        <div style="background:#fff;border-radius:10px;padding:16px 20px;margin-bottom:24px;border:1px solid #e8e3d8">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:.12em;color:#8A945B;font-weight:700">Order Number</p>
          <p style="margin:4px 0 0;font-size:20px;font-weight:800;color:#173F32">${order.orderNumber}</p>
        </div>

        <div style="text-align:center;margin-top:28px">
          <a href="http://localhost:5173/account/orders/${order.orderNumber}" style="display:inline-block;background:#173F32;color:#FAF6EC;padding:14px 28px;border-radius:8px;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;text-decoration:none">View Live Order Status</a>
        </div>

        ${footerHtml}
      </div>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: getFromAddress(),
      to: order.email,
      subject: `${statusSubject[newStatus] || "Order Update"} — MORO Snacks`,
      html,
    });
    console.log(`📧 [Mailer] Status update (${newStatus}) sent to ${order.email}`);
    return { ok: true, channel: "smtp" };
  } catch (err) {
    console.warn(`📧 [Mailer:DevFallback] (${err.code || err.message}) Status update (${newStatus}) logged for ${order.email} (Order ${order.orderNumber})`);
    return { ok: true, channel: "dev_fallback", note: "SMTP auth failed, simulated in console" };
  }
}

/**
 * 3. Promotional Campaign / Discount Sale Blast Email
 */
export async function sendPromoEmail({ subject, title, message, discountCode, discountDetails, ctaUrl, recipients }) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Mailer] SMTP unset — logging promo broadcast to ${recipients.length} recipients. Code: ${discountCode}`);
    return { ok: true, channel: "email_dev_mode", count: recipients.length };
  }

  const html = `
    <div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:580px;margin:20px auto;color:#173F32;line-height:1.5">
      ${headerHtml}
      <div style="background:#FAF6EC;padding:36px 32px;border-radius:0 0 12px 12px;border:1px solid #e8e3d8;border-top:none;text-align:center">
        <span style="display:inline-block;background:#E87536;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.14em;padding:5px 14px;border-radius:999px;margin-bottom:16px">
          Special Offer 🔥
        </span>
        <h2 style="margin:0 0 12px;font-size:24px;color:#173F32;font-weight:800">${title}</h2>
        <p style="color:#555;font-size:15px;line-height:1.6;margin:0 auto 28px;max-width:440px">${message}</p>

        ${discountCode ? `
          <div style="background:#fff;border:2px dashed #E87536;border-radius:12px;padding:20px;max-width:320px;margin:0 auto 28px">
            <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#888;font-weight:600">Use Coupon Code At Checkout</p>
            <p style="margin:6px 0 4px;font-size:28px;font-weight:900;letter-spacing:0.1em;color:#E87536">${discountCode}</p>
            ${discountDetails ? `<p style="margin:0;font-size:13px;color:#555;font-weight:600">${discountDetails}</p>` : ""}
          </div>
        ` : ""}

        <div style="margin-top:20px">
          <a href="${ctaUrl || "http://localhost:5173/shop"}" style="display:inline-block;background:#173F32;color:#FAF6EC;padding:15px 36px;border-radius:8px;font-size:13px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;text-decoration:none">Claim Discount & Shop Now</a>
        </div>

        ${footerHtml}
      </div>
    </div>`;

  const results = [];
  for (const email of recipients) {
    try {
      await getTransporter().sendMail({
        from: getFromAddress(),
        to: email,
        subject: subject || `${title} — MORO Snacks`,
        html,
      });
      results.push({ email, ok: true });
    } catch (e) {
      results.push({ email, ok: false, error: e.message });
    }
  }

  console.log(`📧 [Mailer] Promo campaign sent to ${results.filter(r => r.ok).length} recipients`);
  return { ok: true, results };
}

/**
 * 4. Newsletter Welcome Email with 10% Discount Code
 */
export async function sendWelcomeNewsletterEmail(email) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log(`[Mailer] SMTP unset — logging welcome newsletter to ${email} with code WELCOME10`);
    return { ok: true, channel: "email_dev_mode" };
  }

  const html = `
    <div style="font-family:'Segoe UI',system-ui,sans-serif;max-width:580px;margin:20px auto;color:#173F32;line-height:1.5">
      ${headerHtml}
      <div style="background:#FAF6EC;padding:36px 32px;border-radius:0 0 12px 12px;border:1px solid #e8e3d8;border-top:none;text-align:center">
        <h2 style="margin:0 0 12px;font-size:24px;color:#173F32">Welcome to the Crunch Club! 🎉</h2>
        <p style="color:#555;font-size:14.5px;line-height:1.6;margin:0 auto 24px;max-width:440px">
          You're now on the insider list. Expect fresh restock alerts, new flavour drops, and secret tasting batches.
        </p>

        <div style="background:#fff;border:2px dashed #E87536;border-radius:12px;padding:18px;max-width:300px;margin:0 auto 24px">
          <p style="margin:0;font-size:11px;text-transform:uppercase;letter-spacing:.15em;color:#888;font-weight:600">Your First Order Code</p>
          <p style="margin:4px 0;font-size:26px;font-weight:900;letter-spacing:0.1em;color:#E87536">WELCOME10</p>
          <p style="margin:0;font-size:12px;color:#555">10% OFF orders over ₹499</p>
        </div>

        <a href="http://localhost:5173/shop" style="display:inline-block;background:#173F32;color:#FAF6EC;padding:14px 32px;border-radius:8px;font-size:12px;text-transform:uppercase;letter-spacing:0.15em;font-weight:700;text-decoration:none">Explore The Range</a>

        ${footerHtml}
      </div>
    </div>`;

  try {
    await getTransporter().sendMail({
      from: getFromAddress(),
      to: email,
      subject: "Welcome to MORO! Here's 10% off your first pack 🎁",
      html,
    });
    console.log(`📧 [Mailer] Newsletter welcome email sent to ${email}`);
    return { ok: true, channel: "smtp" };
  } catch (err) {
    console.warn(`📧 [Mailer:DevFallback] (${err.code || err.message}) Welcome email logged for ${email} with code WELCOME10`);
    return { ok: true, channel: "dev_fallback", note: "SMTP auth failed, simulated in console" };
  }
}

import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { connectDB } from "./src/db/connect.js";
import authRoutes from "./src/routes/auth.js";
import productRoutes from "./src/routes/products.js";
import orderRoutes from "./src/routes/orders.js";
import paymentRoutes from "./src/routes/payments.js";
import couponRoutes from "./src/routes/coupons.js";
import adminRoutes from "./src/routes/admin.js";
import newsletterRoutes from "./src/routes/newsletter.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ── Security & parsing ──────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());

// ── Rate limiting ───────────────────────────────────────────
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many auth attempts." });
app.use("/api", limiter);
app.use("/api/auth", authLimiter);

// ── Routes ──────────────────────────────────────────────────
app.use("/api/auth",     authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders",   orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/coupons",    couponRoutes);
app.use("/api/admin",      adminRoutes);
app.use("/api/newsletter", newsletterRoutes);

// ── Health ──────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", env: process.env.NODE_ENV, time: new Date().toISOString() })
);

app.use(errorHandler);

// ── Boot ────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () =>
    console.log(`\n✅  MORO API running → http://localhost:${PORT}/api/health\n`)
  );
});

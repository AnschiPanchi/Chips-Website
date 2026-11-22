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
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const allowedOrigins = [
  "https://moro-chips.vercel.app",
  "https://morochipsbackend.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((u) => u.replace(/\/$/, ""));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile, curl, same-origin)
      if (!origin) return callback(null, true);
      const clean = origin.replace(/\/$/, "");
      if (
        allowedOrigins.includes(clean) ||
        clean.endsWith(".vercel.app") ||
        clean.includes("localhost")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
      "X-Api-Key",
      "X-CSRF-Token",
    ],
  })
);

// Explicit preflight OPTIONS handler
app.options("*", cors());

// CORS headers fallback
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (
    origin &&
    (origin.endsWith(".vercel.app") ||
      origin.includes("localhost") ||
      origin.includes("moro-chips"))
  ) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Api-Key, X-CSRF-Token"
    );
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// ── Database Connection Middleware (cached for serverless) ──
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Normalize double slashes in URL to prevent Vercel 308 preflight redirects
app.use((req, _res, next) => {
  if (req.url.includes("//")) {
    req.url = req.url.replace(/\/+/g, "/");
  }
  next();
});

// ── Rate limiting ───────────────────────────────────────────
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: "Too many auth attempts." });
app.use("/api", limiter);
app.use("/api/auth", authLimiter);

// ── Routes (mounted on both /api/* and root /* so any URL works) ──
app.use(["/api/auth", "/auth"],             authRoutes);
app.use(["/api/products", "/products"],     productRoutes);
app.use(["/api/orders", "/orders"],         orderRoutes);
app.use(["/api/payments", "/payments"],     paymentRoutes);
app.use(["/api/coupons", "/coupons"],       couponRoutes);
app.use(["/api/admin", "/admin"],           adminRoutes);
app.use(["/api/newsletter", "/newsletter"], newsletterRoutes);

// ── Health ──────────────────────────────────────────────────
app.get(["/api/health", "/health", "/api", "/"], (_req, res) =>
  res.json({ status: "ok", name: "MORO Snacks API", env: process.env.NODE_ENV, time: new Date().toISOString() })
);

app.use(errorHandler);

// ── Boot ────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () =>
        console.log(`\n✅  MORO API running → http://localhost:${PORT}/api/health\n`)
      );
    })
    .catch((err) => console.error("Database connection failed on startup:", err.message));
}

export default app;

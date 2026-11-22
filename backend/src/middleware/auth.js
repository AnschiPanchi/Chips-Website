import jwt from "jsonwebtoken";
import { User } from "../db/models.js";

export async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) {
      return res.status(401).json({ ok: false, message: "Authentication required" });
    }
    const token = auth.slice(7);
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    req.userRole = payload.role;
    next();
  } catch {
    res.status(401).json({ ok: false, message: "Token invalid or expired" });
  }
}

// Strict admin guard — only users with role === 'admin' can proceed
export async function requireAdmin(req, res, next) {
  await requireAuth(req, res, async () => {
    if (req.userRole !== "admin") {
      return res.status(403).json({ ok: false, message: "Forbidden: Admin access only" });
    }
    next();
  });
}

export function optionalAuth(req, _res, next) {
  const auth = req.headers.authorization;
  if (auth?.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET);
      req.userId = payload.sub;
      req.userRole = payload.role;
    } catch {
      // ignore — anonymous request is fine
    }
  }
  next();
}

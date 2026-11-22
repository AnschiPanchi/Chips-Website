import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../db/models.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

function signAccess(user) {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m" }
  );
}

function signRefresh(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || "30d" }
  );
}

function userPayload(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    addresses: user.addresses,
  };
}

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone = "" } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ ok: false, message: "name, email and password are required" });
    if (password.length < 8)
      return res.status(400).json({ ok: false, message: "Password must be at least 8 characters" });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing)
      return res.status(409).json({ ok: false, message: "An account with this email already exists" });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, phone, passwordHash });

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    user.refreshTokens.push(refreshToken);
    await user.save();

    res.status(201).json({ ok: true, accessToken, refreshToken, user: userPayload(user) });
  } catch (err) { next(err); }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ ok: false, message: "Email and password are required" });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ ok: false, message: "Invalid email or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(401).json({ ok: false, message: "Invalid email or password" });

    const accessToken = signAccess(user);
    const refreshToken = signRefresh(user);
    user.refreshTokens.push(refreshToken);
    // Keep only last 5 refresh tokens
    if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5);
    await user.save();

    res.json({ ok: true, accessToken, refreshToken, user: userPayload(user) });
  } catch (err) { next(err); }
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ ok: false, message: "No refresh token" });

    let payload;
    try {
      payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ ok: false, message: "Refresh token invalid or expired" });
    }

    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokens.includes(refreshToken))
      return res.status(401).json({ ok: false, message: "Refresh token revoked" });

    // Rotate
    user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
    const newAccess = signAccess(user);
    const newRefresh = signRefresh(user);
    user.refreshTokens.push(newRefresh);
    await user.save();

    res.json({ ok: true, accessToken: newAccess, refreshToken: newRefresh });
  } catch (err) { next(err); }
});

// POST /api/auth/logout
router.post("/logout", requireAuth, async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const user = await User.findById(req.userId);
    if (user && refreshToken) {
      user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
      await user.save();
    }
    res.json({ ok: true, message: "Logged out" });
  } catch (err) { next(err); }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash -refreshTokens -resetToken -resetTokenExpiry");
    if (!user) return res.status(404).json({ ok: false, message: "User not found" });
    res.json({ ok: true, user });
  } catch (err) { next(err); }
});

// PATCH /api/auth/me
router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { ...(name && { name }), ...(phone !== undefined && { phone }) },
      { new: true }
    ).select("-passwordHash -refreshTokens -resetToken -resetTokenExpiry");
    res.json({ ok: true, user });
  } catch (err) { next(err); }
});

// PATCH /api/auth/change-password
router.patch("/change-password", requireAuth, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ ok: false, message: "Both passwords required" });
    if (newPassword.length < 8)
      return res.status(400).json({ ok: false, message: "New password must be at least 8 characters" });

    const user = await User.findById(req.userId);
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid)
      return res.status(400).json({ ok: false, message: "Current password is incorrect" });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.refreshTokens = []; // invalidate all sessions
    await user.save();
    res.json({ ok: true, message: "Password updated — please log in again" });
  } catch (err) { next(err); }
});

// POST /api/auth/addresses
router.post("/addresses", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const addr = { ...req.body, _id: new (await import("mongoose")).default.Types.ObjectId() };
    user.addresses.push(addr);
    await user.save();
    res.status(201).json({ ok: true, addresses: user.addresses });
  } catch (err) { next(err); }
});

// PATCH /api/auth/addresses/:id
router.patch("/addresses/:id", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const addr = user.addresses.id(req.params.id);
    if (!addr) return res.status(404).json({ ok: false, message: "Address not found" });
    Object.assign(addr, req.body);
    await user.save();
    res.json({ ok: true, addresses: user.addresses });
  } catch (err) { next(err); }
});

// DELETE /api/auth/addresses/:id
router.delete("/addresses/:id", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    user.addresses = user.addresses.filter(a => a._id.toString() !== req.params.id);
    await user.save();
    res.json({ ok: true, addresses: user.addresses });
  } catch (err) { next(err); }
});

export default router;

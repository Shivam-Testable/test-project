const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { toPublicUser } = require("../store");

const router = express.Router();

/**
 * GET /api/v1/home — TESR-5 (backend only)
 * Requires Authorization: Bearer <token>
 */
router.get("/", requireAuth, (req, res) => {
  const user = toPublicUser(req.user);
  return res.status(200).json({
    welcome: `Welcome back, ${user.displayName || user.email}`,
    user,
    generatedAt: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/home/profile — TESR-9 (combined with Home profile card UI)
 * Requires Authorization: Bearer <token>
 */
router.get("/profile", requireAuth, (req, res) => {
  const user = toPublicUser(req.user);
  return res.status(200).json({
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
    memberSince: user.createdAt,
  });
});

/**
 * GET /api/v1/home/tip — TESR-11 (combined with tip banner UI)
 * Requires Authorization: Bearer <token>
 */
router.get("/tip", requireAuth, (req, res) => {
  const user = toPublicUser(req.user);
  const name = user.displayName || user.email;
  return res.status(200).json({
    tip: `Hi ${name}, keep your display name up to date so teammates recognize you.`,
    title: "Tip",
  });
});

/**
 * GET /api/v1/home/status — TESR-12 (backend only)
 * Requires Authorization: Bearer <token>
 */
router.get("/status", requireAuth, (req, res) => {
  const user = toPublicUser(req.user);
  return res.status(200).json({
    status: "active",
    email: user.email,
    displayName: user.displayName,
  });
});

module.exports = router;

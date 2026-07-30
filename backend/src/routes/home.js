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

module.exports = router;

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

module.exports = router;

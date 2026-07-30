const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { updateDisplayName, getPreferences, updatePreferences } = require("../store");

const router = express.Router();

/**
 * PATCH /api/v1/users/me — TESR-7 (backend only)
 * Body: { displayName }
 */
router.patch("/me", requireAuth, (req, res) => {
  const displayName = req.body?.displayName;

  if (typeof displayName !== "string" || displayName.trim().length < 2) {
    return res.status(400).json({
      error: "INVALID_DISPLAY_NAME",
      message: "displayName must be at least 2 characters",
    });
  }

  if (displayName.trim().length > 80) {
    return res.status(400).json({
      error: "INVALID_DISPLAY_NAME",
      message: "displayName must be at most 80 characters",
    });
  }

  try {
    const user = updateDisplayName(req.user.id, displayName.trim());
    return res.status(200).json({
      message: "Display name updated",
      user,
    });
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({
        error: "NOT_FOUND",
        message: err.message,
      });
    }
    console.error("update display name failed", err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to update display name",
    });
  }
});

/**
 * GET /api/v1/users/me/preferences — TESR-15
 */
router.get("/me/preferences", requireAuth, (req, res) => {
  try {
    const preferences = getPreferences(req.user.id);
    return res.status(200).json({ preferences });
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ error: "NOT_FOUND", message: err.message });
    }
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to load preferences",
    });
  }
});

/**
 * PUT /api/v1/users/me/preferences — TESR-15
 * Body: { emailAlerts?: boolean, productTips?: boolean }
 */
router.put("/me/preferences", requireAuth, (req, res) => {
  const emailAlerts = req.body?.emailAlerts;
  const productTips = req.body?.productTips;

  if (emailAlerts !== undefined && typeof emailAlerts !== "boolean") {
    return res.status(400).json({
      error: "INVALID_PREFERENCES",
      message: "emailAlerts must be a boolean",
    });
  }
  if (productTips !== undefined && typeof productTips !== "boolean") {
    return res.status(400).json({
      error: "INVALID_PREFERENCES",
      message: "productTips must be a boolean",
    });
  }
  if (emailAlerts === undefined && productTips === undefined) {
    return res.status(400).json({
      error: "INVALID_PREFERENCES",
      message: "Provide emailAlerts and/or productTips",
    });
  }

  try {
    const preferences = updatePreferences(req.user.id, { emailAlerts, productTips });
    return res.status(200).json({
      message: "Preferences updated",
      preferences,
    });
  } catch (err) {
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ error: "NOT_FOUND", message: err.message });
    }
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to update preferences",
    });
  }
});

module.exports = router;

const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { updateDisplayName } = require("../store");

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

module.exports = router;

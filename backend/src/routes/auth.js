const express = require("express");
const {
  createUser,
  verifyCredentials,
  createSession,
  destroySession,
  getSessionByToken,
  listSessionsForUser,
  destroySessionById,
  changePassword,
  toPublicUser,
} = require("../store");
const { getBearerToken, requireAuth } = require("../middleware/auth");

const router = express.Router();

function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * POST /api/v1/auth/register
 * Body: { email, password }
 */
router.post("/register", (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: "INVALID_EMAIL",
      message: "A valid email is required",
    });
  }

  if (typeof password !== "string" || password.length < 8) {
    return res.status(400).json({
      error: "INVALID_PASSWORD",
      message: "Password must be at least 8 characters",
    });
  }

  try {
    const user = createUser({ email, password });
    return res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    if (err.code === "DUPLICATE_EMAIL") {
      return res.status(409).json({
        error: "DUPLICATE_EMAIL",
        message: err.message,
      });
    }
    console.error("register failed", err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Registration failed",
    });
  }
});

/**
 * POST /api/v1/auth/login — TESR-3
 * Body: { email, password }
 */
router.post("/login", (req, res) => {
  const email = req.body?.email;
  const password = req.body?.password;

  if (!isValidEmail(email) || typeof password !== "string" || !password) {
    return res.status(400).json({
      error: "INVALID_CREDENTIALS",
      message: "Email and password are required",
    });
  }

  const user = verifyCredentials(email, password);
  if (!user) {
    return res.status(401).json({
      error: "INVALID_CREDENTIALS",
      message: "Invalid email or password",
    });
  }

  const token = createSession(user, { label: "Web session" });
  return res.status(200).json({
    message: "Logged in successfully",
    token,
    user: toPublicUser(user),
  });
});

/**
 * POST /api/v1/auth/logout — TESR-4
 */
router.post("/logout", requireAuth, (req, res) => {
  destroySession(req.authToken || getBearerToken(req));
  return res.status(200).json({
    message: "Logged out successfully",
  });
});

/**
 * GET /api/v1/auth/sessions — TESR-13
 */
router.get("/sessions", requireAuth, (req, res) => {
  const current = getSessionByToken(req.authToken || getBearerToken(req));
  const sessions = listSessionsForUser(req.user.id).map(({ token, ...rest }) => ({
    ...rest,
    current: Boolean(current && current.id === rest.id),
  }));
  return res.status(200).json({ sessions });
});

/**
 * DELETE /api/v1/auth/sessions/:id — TESR-13
 */
router.delete("/sessions/:id", requireAuth, (req, res) => {
  const sessionId = req.params.id;
  const removed = destroySessionById(req.user.id, sessionId);
  if (!removed) {
    return res.status(404).json({
      error: "SESSION_NOT_FOUND",
      message: "Session not found",
    });
  }
  return res.status(200).json({
    message: "Session revoked",
    id: sessionId,
  });
});

/**
 * POST /api/v1/auth/change-password — TESR-14
 * Body: { currentPassword, newPassword }
 */
router.post("/change-password", requireAuth, (req, res) => {
  const currentPassword = req.body?.currentPassword;
  const newPassword = req.body?.newPassword;

  try {
    changePassword(req.user.id, currentPassword, newPassword);
    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    if (err.code === "INVALID_CURRENT_PASSWORD") {
      return res.status(401).json({
        error: err.code,
        message: err.message,
      });
    }
    if (err.code === "INVALID_NEW_PASSWORD") {
      return res.status(400).json({
        error: err.code,
        message: err.message,
      });
    }
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({
        error: err.code,
        message: err.message,
      });
    }
    console.error("change password failed", err);
    return res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to change password",
    });
  }
});

module.exports = router;

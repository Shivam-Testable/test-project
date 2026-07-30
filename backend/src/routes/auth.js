const express = require("express");
const { createUser } = require("../store");

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

module.exports = router;

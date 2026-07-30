/** In-memory user store for the Stage 1 demo (not for production). */

const usersByEmail = new Map();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function findByEmail(email) {
  return usersByEmail.get(normalizeEmail(email)) || null;
}

function createUser({ email, password }) {
  const normalized = normalizeEmail(email);
  if (usersByEmail.has(normalized)) {
    const err = new Error("Email already registered");
    err.code = "DUPLICATE_EMAIL";
    throw err;
  }

  const user = {
    id: `user_${usersByEmail.size + 1}`,
    email: normalized,
    password,
    createdAt: new Date().toISOString(),
  };
  usersByEmail.set(normalized, user);
  return { id: user.id, email: user.email, createdAt: user.createdAt };
}

module.exports = { findByEmail, createUser };

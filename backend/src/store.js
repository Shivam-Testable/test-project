/** In-memory user + session store for the Stage demo (not for production). */

const crypto = require("crypto");

const usersByEmail = new Map();
const usersById = new Map();
const sessionsByToken = new Map();

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    createdAt: user.createdAt,
  };
}

function findByEmail(email) {
  return usersByEmail.get(normalizeEmail(email)) || null;
}

function findById(id) {
  return usersById.get(id) || null;
}

function createUser({ email, password }) {
  const normalized = normalizeEmail(email);
  if (usersByEmail.has(normalized)) {
    const err = new Error("Email already registered");
    err.code = "DUPLICATE_EMAIL";
    throw err;
  }

  const user = {
    id: `user_${usersById.size + 1}`,
    email: normalized,
    password,
    displayName: normalized.split("@")[0],
    createdAt: new Date().toISOString(),
  };
  usersByEmail.set(normalized, user);
  usersById.set(user.id, user);
  return toPublicUser(user);
}

function verifyCredentials(email, password) {
  const user = findByEmail(email);
  if (!user || user.password !== password) {
    return null;
  }
  return user;
}

function createSession(user, meta = {}) {
  const token = crypto.randomBytes(24).toString("hex");
  const id = `sess_${crypto.randomBytes(8).toString("hex")}`;
  sessionsByToken.set(token, {
    id,
    userId: user.id,
    createdAt: new Date().toISOString(),
    label: meta.label || "Web session",
  });
  return token;
}

function getUserByToken(token) {
  if (!token) return null;
  const session = sessionsByToken.get(token);
  if (!session) return null;
  return findById(session.userId);
}

function getSessionByToken(token) {
  if (!token) return null;
  return sessionsByToken.get(token) || null;
}

function destroySession(token) {
  if (!token) return false;
  return sessionsByToken.delete(token);
}

function listSessionsForUser(userId) {
  const sessions = [];
  for (const [token, session] of sessionsByToken.entries()) {
    if (session.userId !== userId) continue;
    sessions.push({
      id: session.id,
      createdAt: session.createdAt,
      label: session.label || "Web session",
      token,
    });
  }
  return sessions.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function destroySessionById(userId, sessionId) {
  for (const [token, session] of sessionsByToken.entries()) {
    if (session.userId === userId && session.id === sessionId) {
      sessionsByToken.delete(token);
      return true;
    }
  }
  return false;
}

function updateDisplayName(userId, displayName) {
  const user = findById(userId);
  if (!user) {
    const err = new Error("User not found");
    err.code = "NOT_FOUND";
    throw err;
  }
  user.displayName = displayName;
  return toPublicUser(user);
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  verifyCredentials,
  createSession,
  getUserByToken,
  getSessionByToken,
  destroySession,
  listSessionsForUser,
  destroySessionById,
  updateDisplayName,
  toPublicUser,
};

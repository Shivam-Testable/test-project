const { getUserByToken } = require("../store");

function getBearerToken(req) {
  const header = req.headers.authorization || "";
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1].trim() : null;
}

function requireAuth(req, res, next) {
  const token = getBearerToken(req);
  const user = getUserByToken(token);
  if (!user) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }
  req.authToken = token;
  req.user = user;
  return next();
}

module.exports = { getBearerToken, requireAuth };

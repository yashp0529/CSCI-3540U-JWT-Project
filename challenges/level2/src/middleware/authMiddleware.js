const { verifyToken } = require('../utils/token');

/**
 * Extracts and verifies the JWT from the Authorization header.
 * This looks more secure than level1, but the weak secret makes it bypassable.
 */
function authenticate(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided. Please login first.' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Authorization header must be: Bearer <token>' });
  }

  const token = parts[1];

  // jwt.verify() IS used here — unlike level1.
  // However, the secret ('secret') is so weak that an attacker can crack it
  // and forge a new, validly-signed token with role: "admin".
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }

  req.user = payload;
  next();
}

/**
 * Checks that the authenticated user has the role "admin".
 */
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    error: 'Forbidden: Admin access required.',
    hint: `Your current role is: "${req.user ? req.user.role : 'unknown'}". The token is verified, but can you crack the secret and forge one?`,
  });
}

module.exports = { authenticate, requireAdmin };

const { verifyToken } = require('../utils/token');

/**
 * ✅ SECURE: Extracts and properly verifies the JWT.
 * The token.js uses a cryptographically random secret and restricts algorithms.
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

  // ✅ Proper verification: checks signature, expiry, and algorithm.
  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Invalid, expired, or tampered token. Please login again.' });
  }

  req.user = payload;
  next();
}

/**
 * ✅ Checks that the authenticated user has the role "admin".
 * Because the token cannot be forged, only the real admin user can pass this.
 */
function requireAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    error: 'Forbidden: Admin access required.',
    message: 'This route is protected. The token is fully verified with a strong secret — forging is not possible.',
  });
}

module.exports = { authenticate, requireAdmin };

const { decodeToken } = require('../utils/token');

/**
 * ⚠️  VULNERABLE: Extracts token from header and uses jwt.decode() — NO signature check.
 * Any well-formed JWT with any payload will be accepted, including forged ones.
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

  // ⚠️  CRITICAL FLAW: jwt.decode() reads the payload without checking if the
  // signature is valid. An attacker can modify the payload and keep any signature.
  const payload = decodeToken(token);
  if (!payload) {
    return res.status(401).json({ error: 'Could not decode token — make sure it is a valid JWT format.' });
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
    hint: `Your current role is: "${req.user ? req.user.role : 'unknown'}". Try changing it to "admin" in the token payload.`,
  });
}

module.exports = { authenticate, requireAdmin };

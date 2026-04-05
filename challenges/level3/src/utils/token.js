const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// ✅ SECURE: A cryptographically random 256-bit secret is generated at startup.
// This cannot be brute-forced in any reasonable timeframe.
// In production, load this from an environment variable (process.env.JWT_SECRET).
const SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');

/**
 * Generates a signed JWT for the given user.
 * Token expires in 15 minutes — short-lived tokens limit damage if stolen.
 */
function generateToken(user) {
  return jwt.sign(
    { username: user.username, role: user.role },
    SECRET,
    {
      expiresIn: '15m',          // ✅ Short expiry
      algorithm: 'HS256',        // ✅ Explicit algorithm
    }
  );
}

/**
 * ✅ SECURE: Verifies both the signature AND restricts accepted algorithms.
 * Restricting algorithms prevents the "alg: none" attack.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET, { algorithms: ['HS256'] });
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };

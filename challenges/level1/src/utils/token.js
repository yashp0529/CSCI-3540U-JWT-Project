const jwt = require('jsonwebtoken');

// The server signs tokens with this secret.
// HOWEVER — the middleware never actually verifies the signature (see authMiddleware.js)
// So this secret is essentially meaningless from a security perspective.
const SECRET = 'some-secret-that-is-never-checked';

/**
 * Generates a signed JWT for the given user.
 */
function generateToken(user) {
  return jwt.sign(
    { username: user.username, role: user.role },
    SECRET,
    { expiresIn: '1h' }
  );
}

/**
 * ⚠️  VULNERABLE: Uses jwt.decode() which does NOT verify the signature.
 * This means any JWT — even one with a forged payload — will be accepted.
 */
function decodeToken(token) {
  try {
    return jwt.decode(token); // No verification!
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, decodeToken };

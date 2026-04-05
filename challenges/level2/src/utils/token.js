const jwt = require('jsonwebtoken');

// ⚠️  VULNERABLE: The secret key is extremely weak and easy to brute-force.
// An attacker who obtains a valid JWT can crack this secret using tools
// like hashcat or jwt-cracker, then sign forged tokens that the server accepts.
const SECRET = 'secret';

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
 * Verifies a JWT using the weak secret.
 * jwt.verify() IS called — but the secret is easily cracked.
 */
function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}

module.exports = { generateToken, verifyToken };

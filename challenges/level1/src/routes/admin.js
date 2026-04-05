const express = require('express');
const router  = express.Router();
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// GET /api/admin — only accessible with role: "admin" in the JWT payload
router.get('/', authenticate, requireAdmin, (req, res) => {
  res.json({
    message: '🎉 Admin access granted! You exploited the JWT vulnerability!',
    flag: 'CTF{jwt_n0_v3r1fy_4lw4ys_trust_n3v3r}',
    logged_in_as: req.user.username,
    vulnerability: 'The server used jwt.decode() instead of jwt.verify(). The signature was never checked, allowing any crafted token to be accepted.',
    secret_data: 'Registered users: alice:password123, bob:letmein, admin:Adm1n@V4ult#2024!',
  });
});

module.exports = router;

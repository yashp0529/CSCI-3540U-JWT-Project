const express = require('express');
const router  = express.Router();
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// GET /api/admin — only accessible with role: "admin" in a validly signed JWT
router.get('/', authenticate, requireAdmin, (req, res) => {
  res.json({
    message: '🎉 Admin access granted! You cracked the weak secret!',
    flag: 'CTF{w34k_s3cr3t_1s_n0_s3cr3t_4t_4ll}',
    logged_in_as: req.user.username,
    vulnerability: 'The JWT was signed using the secret "secret". A brute-force attack cracked it, allowing a forged admin token to be created.',
    weak_secret_used: 'secret',
  });
});

module.exports = router;

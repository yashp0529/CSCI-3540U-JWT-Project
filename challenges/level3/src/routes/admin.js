const express = require('express');
const router  = express.Router();
const { authenticate, requireAdmin } = require('../middleware/authMiddleware');

// GET /api/admin — properly secured, only the real admin user can access this
router.get('/', authenticate, requireAdmin, (req, res) => {
  res.json({
    message: `Welcome, Admin ${req.user.username}. This is the secure admin panel.`,
    note: 'Level 3 is fully protected. Tokens are signed with a 256-bit random secret, restricted to HS256, and expire in 15 minutes. Forging is not possible.',
    info: 'No flag here — this is the secure version!',
  });
});

module.exports = router;

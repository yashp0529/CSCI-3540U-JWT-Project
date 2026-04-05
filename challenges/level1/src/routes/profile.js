const express = require('express');
const router  = express.Router();
const { authenticate } = require('../middleware/authMiddleware');

// GET /api/profile — accessible to any logged-in user
router.get('/', authenticate, (req, res) => {
  res.json({
    message: `Welcome back, ${req.user.username}!`,
    user: {
      username: req.user.username,
      role:     req.user.role,
    },
    note: 'This endpoint is accessible to all authenticated users.',
  });
});

module.exports = router;

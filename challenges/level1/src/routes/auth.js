const express = require('express');
const router  = express.Router();
const { users } = require('../data/users');
const { generateToken } = require('../utils/token');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const token = generateToken(user);
  return res.json({
    message: 'Login successful!',
    token,
    user: { username: user.username, role: user.role },
  });
});

module.exports = router;

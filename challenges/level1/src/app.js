const express = require('express');
const path    = require('path');

const authRoutes    = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const adminRoutes   = require('./routes/admin');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/api/auth',    authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin',   adminRoutes);

// Serve the frontend for any other route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════════╗');
  console.log('  ║         TokenVault – Level 1                 ║');
  console.log('  ║   ⚠️  VULNERABLE: No JWT Verification        ║');
  console.log(`  ║   Running on http://localhost:${PORT}           ║`);
  console.log('  ╚══════════════════════════════════════════════╝');
  console.log('');
});

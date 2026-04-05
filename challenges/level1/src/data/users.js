// In a real app, passwords would be hashed (bcrypt) and stored in a database.
// For this CTF demo, plaintext is used to keep the focus on JWT vulnerabilities.
const users = [
  { id: 1, username: 'alice',  password: 'password123',        role: 'user'  },
  { id: 2, username: 'bob',    password: 'letmein',             role: 'user'  },
  { id: 3, username: 'admin',  password: 'Adm1n@V4ult#2024!',  role: 'admin' },
];

module.exports = { users };

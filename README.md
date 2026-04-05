# TokenVault – JWT Authentication Vulnerabilities CTF
### CSCI 3540U Independent Study Project | Winter 2026

**Topic:** JWT Authentication Vulnerabilities in Web Applications  
**Group:** Aryan Patel, Mansi Kandoi, Yash Patel, Saahir Dhani, Eva Nathani

---

## What is this?

**TokenVault** is a web-based credential vault application that uses JSON Web Token (JWT) authentication. The same application is implemented in three security levels to demonstrate real-world JWT vulnerabilities and how to defend against them.

| Level | Vulnerability | Description |
|-------|-------------|-------------|
| Level 1 | No JWT Verification | Server uses `jwt.decode()` — signature never checked |
| Level 2 | Weak Secret Key | Server uses `jwt.verify()` with secret `"secret"` — easily cracked |
| Level 3 | Secure | Strong secret, algorithm restriction, expiry — fully protected |

---

## Project Structure

```
jwt-ctf/
├── challenges/
│   ├── level1/    ← Fully vulnerable (no signature verification)
│   ├── level2/    ← Weakly protected (weak secret key – bypassable)
│   └── level3/    ← Fully secure (strong secret + proper verification)
├── writeups/
│   ├── level1/    ← Exploitation write-up for Level 1
│   └── level2/    ← Exploitation write-up for Level 2
├── presentation/  ← Slides, speaking notes, and video
└── peer-evaluation/
```

---

## Quick Start

Each level runs independently via Docker. Navigate into each level folder and run:

```bash
docker build -t tokenvault-level1 .
docker run -p 3001:3000 tokenvault-level1
```

| Level | URL | Vulnerability |
|-------|-----|---------------|
| Level 1 | http://localhost:3001 | No JWT verification |
| Level 2 | http://localhost:3002 | Weak secret (`"secret"`) |
| Level 3 | http://localhost:3003 | Fully secure |

See `HOW_TO_RUN.md` for the full step-by-step guide (with screenshots and exploit instructions).

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Any modern web browser

No other setup required.

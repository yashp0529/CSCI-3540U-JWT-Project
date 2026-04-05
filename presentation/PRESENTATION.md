# Presentation – JWT Authentication Vulnerabilities

**Group:** Aryan Patel, Mansi Kandoi, Yash Patel, Saahir Dhani, Eva Nathani  
**Course:** CSCI 3540U – Software Security  
**Topic:** JWT Authentication Vulnerabilities in Web Applications

---

## Presentation Materials

| File | Description |
|------|-------------|
| `slides/jwt-authentication-vulnerabilities.pptx` | Main presentation slides |
| `script/speaking-notes.md` | Speaker notes for each slide |
| `video/final-presentation.mp4` | Final recorded presentation video (~8 min) |
| `assets/jwt-diagram.png` | JWT structure diagram |
| `assets/demo-screenshots.png` | Screenshots from the live demo |

---

## Presentation Outline (~8 minutes)

### Part 1 – Introduction to JWT Vulnerabilities (~2 min)
- What is JWT and how it works (Header, Payload, Signature)
- Why JWT is commonly used for authentication
- Overview of the two vulnerabilities demonstrated in this project:
  - Missing signature verification (`jwt.decode()` vs `jwt.verify()`)
  - Weak HMAC secret key (brute-forceable)

### Part 2 – How to Exploit These Vulnerabilities (~2 min)
- **Level 1 Attack:** Modify JWT payload → change role to admin → server accepts without checking signature
- **Level 2 Attack:** Capture JWT → brute-force HMAC secret with jwt-cracker → forge valid admin token

### Part 3 – Live Demo (~2 min)
- Live exploitation of Level 2 (weak secret):
  1. Login as alice, capture token
  2. Run jwt-cracker to crack the secret
  3. Forge an admin token using Node.js
  4. Access the admin panel with the forged token and capture the flag

### Part 4 – How to Protect Against These Vulnerabilities (~2 min)
- Always use `jwt.verify()` — never `jwt.decode()` for authentication
- Use a cryptographically random secret of at least 256 bits
- Restrict allowed algorithms (`{ algorithms: ['HS256'] }`)
- Set short token expiry (e.g., 15 minutes)
- Consider using asymmetric signing (RS256/ES256) for even stronger security

# Team Contributions — TokenVault JWT CTF

**Course:** CSCI 3540U – Software Security  
**Project:** JWT Authentication Vulnerabilities  
**Semester:** Winter 2026  
**Ontario Tech University**

---

## 👥 Team Members & Contributions

This document breaks down what each person contributed to the project. The work was divided as evenly as possible so that everyone touched both the technical and documentation sides of things.

---

### 1. Aryan Patel — @patelaryan12
**Role: Project Lead + Level 1 Challenge**

Aryan was responsible for setting up the project structure and getting the team organized from the start. He created the initial GitHub repository, set up the folder layout, and made sure everyone understood what needed to be done and by when.

On the technical side, Aryan built **Level 1** — the intentionally vulnerable version of the app with no JWT signature verification. This involved:
- Writing the `authMiddleware.js` for Level 1, which uses `jwt.decode()` instead of `jwt.verify()` — the core vulnerability
- Writing the `token.js` utility that generates tokens but never properly verifies them
- Writing the `auth.js`, `profile.js`, and `admin.js` route handlers
- Setting up `users.js` with the hardcoded user accounts used across all levels
- Writing the `app.js` Express entry point for Level 1

Aryan also wrote this project's main `README.md` so anyone who visits the GitHub repo understands what the project is and how to run it.

**Files owned:**
- `challenges/level1/src/middleware/authMiddleware.js`
- `challenges/level1/src/utils/token.js`
- `challenges/level1/src/routes/auth.js`
- `challenges/level1/src/routes/profile.js`
- `challenges/level1/src/routes/admin.js`
- `challenges/level1/src/data/users.js`
- `challenges/level1/src/app.js`
- `README.md`

---

### 2. Mansi Kandoi — @Mansikandoi
**Role: Level 2 Challenge + Brute-Force Demo**

Mansi built **Level 2** — the version where JWT verification is used but the secret key is dangerously weak (`"secret"`). This required understanding how HMAC-SHA256 signing works and deliberately choosing a secret that would be trivially crackable.

Her work included:
- Writing the `authMiddleware.js` for Level 2, which correctly calls `jwt.verify()` but with the weak secret
- Writing the `token.js` for Level 2 with the intentionally weak secret constant (`const SECRET = 'secret'`)
- Copying and adapting all route handlers from Level 1 for Level 2
- Creating `tools/brute-force-demo.txt` — a complete walkthrough explaining how an attacker would use `jwt-cracker` or `hashcat` to crack the secret, then forge an admin token
- Testing the brute-force attack herself using `jwt-cracker` to confirm it works and that the output matches what's described

She also researched how HMAC secret cracking works in practice, which fed into both the Level 2 design and the write-up for Level 2.

**Files owned:**
- `challenges/level2/src/middleware/authMiddleware.js`
- `challenges/level2/src/utils/token.js`
- `challenges/level2/src/routes/auth.js`
- `challenges/level2/src/routes/profile.js`
- `challenges/level2/src/routes/admin.js`
- `challenges/level2/src/data/users.js`
- `challenges/level2/src/app.js`
- `challenges/level2/tools/brute-force-demo.txt`

---

### 3. Yash Patel — @yashp0529
**Role: Level 3 (Secure Version) + Security Research**

Yash was responsible for building **Level 3** — the properly secured version of the app. His job was essentially the opposite of Levels 1 and 2: instead of introducing vulnerabilities, he had to make sure the app was as secure as possible and couldn't be exploited using the same techniques.

His contributions:
- Writing the `token.js` for Level 3 using `crypto.randomBytes(32)` to generate a 256-bit random secret at startup — making brute-force attacks computationally infeasible
- Writing the `authMiddleware.js` for Level 3, which uses `jwt.verify()` with algorithm restriction (`{ algorithms: ['HS256'] }`) to block the "alg: none" attack
- Adding token expiry (`expiresIn: '15m'`) to limit the damage from stolen tokens
- Copying and adapting all route handlers from Level 1 for Level 3
- Researching JWT security best practices and writing the comments throughout the Level 3 code explaining what each security measure does and why

Yash also spent time researching the "alg: none" JWT attack (where an attacker changes the header to claim no signature is needed) and made sure Level 3 blocks it.

**Files owned:**
- `challenges/level3/src/middleware/authMiddleware.js`
- `challenges/level3/src/utils/token.js`
- `challenges/level3/src/routes/auth.js`
- `challenges/level3/src/routes/profile.js`
- `challenges/level3/src/routes/admin.js`
- `challenges/level3/src/data/users.js`
- `challenges/level3/src/app.js`

---

### 4. Saahir Dhani — @SaahirD
**Role: Frontend UI + Docker Setup + HOW_TO_RUN**

Saahir handled everything related to deploying and running the challenges — which is important because the assignment says the project should be runnable with a single command. He also designed and built the web interface for all three challenge levels.

His contributions:
- Designing and writing the frontend `public/index.html` for all three levels, each with a distinct color scheme:
  - Level 1: Dark red theme, showing the token and a custom token editor
  - Level 2: Dark amber theme, with built-in instructions for cracking and forging
  - Level 3: Dark green theme, showing the security measures in place
- Writing the `Dockerfile` and `.dockerignore` for all three levels
- Writing the `package.json` for all three levels
- Writing the per-level `HOW_TO_RUN.md` files (simple, single-command instructions as required)
- Writing the comprehensive root-level `HOW_TO_RUN.md` with full setup instructions, step-by-step exploit guides, and troubleshooting for common issues
- Verifying that all three levels build and run correctly in Docker from a clean state

Saahir made sure the frontend wasn't just functional — it's actually part of the learning experience. For example, the Level 2 UI shows the exact commands needed to crack the secret and forge a token, right on the page, so that even someone who hasn't done CTF before can follow along.

**Files owned:**
- `challenges/level1/src/public/index.html`
- `challenges/level2/src/public/index.html`
- `challenges/level3/src/public/index.html`
- `challenges/level1/Dockerfile`
- `challenges/level2/Dockerfile`
- `challenges/level3/Dockerfile`
- `challenges/level1/.dockerignore`
- `challenges/level2/.dockerignore`
- `challenges/level3/.dockerignore`
- `challenges/level1/package.json`
- `challenges/level2/package.json`
- `challenges/level3/package.json`
- `challenges/level1/HOW_TO_RUN.md`
- `challenges/level2/HOW_TO_RUN.md`
- `challenges/level3/HOW_TO_RUN.md`
- `HOW_TO_RUN.md` (root-level comprehensive guide)

---

### 5. Eva Nathani — @EvaNathani
**Role: Write-Ups + Presentation + Documentation**

Eva handled all of the written documentation and presentation materials. This includes the two exploitation write-ups (for Level 1 and Level 2), the presentation outline, the speaker notes, and the peer evaluation templates.

Her contributions:
- Writing the **Level 1 write-up** (`writeups/level1/writeup.md`) — a full step-by-step walkthrough of the payload-editing attack, including the exact commands used, the outputs received, and an explanation of why the attack works
- Writing the **Level 2 write-up** (`writeups/level2/writeup.md`) — a full walkthrough of the HMAC secret cracking attack, including failed attempts (trying the Level 1 attack first, trying "alg: none"), the jwt-cracker commands, and the token forging process
- Writing `presentation/PRESENTATION.md` with the full outline of all four presentation sections (~2 min each) 
- Writing `presentation/script/speaking-notes.md` — detailed word-for-word speaking notes for each slide, written in a natural, conversational tone that the whole team can use
- Creating the peer evaluation templates (`peer-evaluation/group1-eval.md` and `group2-eval.md`) so the team has a consistent, thorough framework for evaluating other groups
- Writing the root-level `team.md` (this file) with everyone's contributions documented in detail

Eva made sure all the write-ups include failed attempts and explain the thought process — not just "here's the answer" but "here's how we got there" — which is exactly what the assignment rubric asks for.

**Files owned:**
- `writeups/level1/writeup.md`
- `writeups/level2/writeup.md`
- `presentation/PRESENTATION.md`
- `presentation/script/speaking-notes.md`
- `peer-evaluation/group1-eval.md`
- `peer-evaluation/group2-eval.md`
- `team.md` (this file)

---

## 📊 Work Distribution Summary

| Component | Person |
|-----------|--------|
| Project setup & GitHub repository | Aryan |
| Level 1 challenge (vulnerable — no verification) | Aryan |
| Level 2 challenge (vulnerable — weak secret) | Mansi |
| Brute-force demo & attack research | Mansi |
| Level 3 challenge (secure version) | Yash |
| JWT security research (alg:none, strong secrets) | Yash |
| Frontend UI for all 3 levels | Saahir |
| Docker configuration for all 3 levels | Saahir |
| HOW_TO_RUN guides | Saahir |
| Level 1 write-up | Eva |
| Level 2 write-up | Eva |
| Presentation outline & speaking notes | Eva |
| Peer evaluation templates | Eva |
| Main README | Aryan |
| Team documentation (this file) | Eva |

---

## 🗓️ How We Divided the Work

We split the project into 5 roughly equal parts so everyone had a mix of coding and writing:

- **Aryan** took ownership of the project foundation and Level 1 — the starting point that everything else builds on
- **Mansi** built Level 2 and researched the specific attack (brute-forcing HMAC secrets) that makes it exploitable
- **Yash** built Level 3 and made sure it's actually secure — not just "looks secure"
- **Saahir** handled everything that makes the project easy to run and look good — Docker, the web UI, the run guides
- **Eva** handled all documentation that explains what we did and why — the write-ups, presentation, and this file

Everyone was involved in testing. Each person tested the level they didn't build to make sure the attacks work as described in the write-ups.

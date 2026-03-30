# Presentation – NetProbe: Command Injection

**CSCI 3540U Independent Study Project | Winter 2026**
**Group:** Yash, Saahir, Eva, Mansi, Aaryan

---

## Presentation Structure (~8 minutes)

### Part 1 – Introduction to Command Injection (~2 mins)
*Presenters: Yash + Saahir*

- What is command injection?
- Where does it occur? (web apps that run server-side commands)
- Why is it dangerous? (full server access, root-level commands)
- OWASP ranking: part of A03:2021 – Injection
- Real-world examples: CVE-2021-41773 (Apache), Shellshock

### Part 2 – How the Attack Works (~2 mins)
*Presenters: Eva + Mansi*

- Explain shell operators: `;`, `|`, `&&`
- Walk through the vulnerable code in Level 1
- Show how blacklist protection (Level 2) is incomplete
- Compare os.popen() vs subprocess.run(list) visually

### Part 3 – Live Demo: Exploiting Level 2 (~2 mins)
*Presenter: Aaryan*

- Launch Level 2 app live (or screen recording)
- Try the semicolon — show it gets blocked
- Use pipe operator to bypass: `google.com | cat /flag.txt`
- Show the flag appearing in the output
- Note: also show `&&` works as a second bypass

### Part 4 – How to Protect Against It (~2 mins)
*All together*

- Never use `shell=True` or `os.popen()` with user input
- Use `subprocess.run()` with a list of arguments (no shell interpretation)
- Apply whitelist input validation (only allow valid hostnames)
- Principle of least privilege: run apps as non-root users
- Show the Level 3 code as the correct solution

---

## Slides Outline

1. **Title slide** – NetProbe: Command Injection CTF
2. **What is Command Injection?** – definition + simple diagram
3. **How Shell Operators Work** – `;` `|` `&&` explained
4. **The Vulnerable Code** – Level 1 code snippet highlighted
5. **Level 2: Weak Protection** – blacklist code + why it fails
6. **Demo** – screenshots or live
7. **The Secure Solution** – Level 3 code comparison
8. **Key Takeaways** – Never trust user input
9. **References** – OWASP, CVEs

---

## Slide Files

> Place slide files (PDF, PPTX, Google Slides link) in this directory.
> Add a link here once available.

---

## References

- OWASP Command Injection: https://owasp.org/www-community/attacks/Command_Injection
- CWE-78 (OS Command Injection): https://cwe.mitre.org/data/definitions/78.html
- Python subprocess docs: https://docs.python.org/3/library/subprocess.html
- CVE-2021-41773 (Apache path traversal + RCE): https://nvd.nist.gov/vuln/detail/CVE-2021-41773

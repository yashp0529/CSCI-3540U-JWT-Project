# Speaking Notes – JWT Authentication Vulnerabilities Presentation

---

## SLIDE 1 – Title Slide
*"Good [morning/afternoon]. Today our group is presenting on JWT Authentication Vulnerabilities — specifically two common but dangerous mistakes developers make when implementing JWT in web applications."*

---

## SLIDE 2 – What is JWT?
*"JSON Web Tokens, or JWTs, are a widely used standard for securely transmitting information between a client and a server. They're especially popular for login systems. A JWT has three parts: the Header, which tells you what algorithm was used; the Payload, which contains the actual data like the username and role; and the Signature, which is a cryptographic hash that proves the token hasn't been tampered with. The three parts are joined by dots and encoded in Base64."*

---

## SLIDE 3 – How JWT Authentication Works
*"The typical flow is: the user logs in with their credentials, the server generates a JWT and sends it back, and from that point on, the client includes the JWT in every request. The server reads the token to identify who the user is and what they're allowed to do. The key assumption here is that the payload can be trusted — but that assumption only holds if the server is properly verifying the signature."*

---

## SLIDE 4 – Vulnerability 1: Missing Signature Verification
*"The first vulnerability we look at is when a developer forgets — or doesn't know — that there's a difference between jwt.decode() and jwt.verify(). The decode function just reads the payload. It doesn't check anything. The verify function checks that the signature matches, meaning the token hasn't been tampered with. If you use decode, any user can edit their own token, change their role to admin, and access protected endpoints. This is what Level 1 of our challenge demonstrates."*

---

## SLIDE 5 – Vulnerability 2: Weak Secret Key
*"The second vulnerability is more subtle. The developer is using jwt.verify() — so signatures are checked. But the secret key used for signing is something like the word 'secret'. HMAC is only as strong as the key. With a weak key, an attacker can use a brute-force tool like jwt-cracker or hashcat to try thousands of words per second until they find the right one. Once they have the secret, they can sign their own tokens with any payload — including admin roles. This is what Level 2 demonstrates."*

---

## SLIDE 6 – Live Demo (Level 2 Exploitation)
*[Switch to live demo or pre-recorded screen capture]*

*"We'll now show the attack live on Level 2. First, we log in as a normal user named alice. We get a token back. We then run jwt-cracker on that token — and in under a second, it tells us the secret is 'secret'. Now we use Node.js to sign a brand new token with the username 'hacker' and the role 'admin'. We paste that into the admin panel request — and we get the flag."*

---

## SLIDE 7 – How to Fix It
*"The fixes are straightforward once you know what the problems are. First, always use jwt.verify() — never jwt.decode() — in your authentication middleware. Second, generate your secret key securely — use a cryptographic random number generator to produce at least 32 bytes of randomness. Third, explicitly restrict the accepted algorithms using the 'algorithms' option, which blocks the 'alg: none' attack. And fourth, set a short token expiry — 15 minutes is common — so that stolen tokens are only useful for a limited time."*

---

## SLIDE 8 – Comparison Table
*"To summarize the three levels: Level 1 has no signature check at all. Level 2 checks the signature but uses a weak key. Level 3 uses proper verification with a 256-bit random secret and algorithm restrictions. Moving from Level 1 to Level 3 shows that JWT itself is not the problem — it's the implementation that matters."*

---

## SLIDE 9 – Conclusion
*"JWT is a solid and widely-used authentication mechanism. But like any security tool, it requires careful implementation. The two vulnerabilities we demonstrated — missing verification and weak secrets — are real-world issues that have appeared in production systems. The key takeaways are: always verify, use strong secrets, restrict algorithms, and set expiry times. Thank you — we're happy to take questions."*

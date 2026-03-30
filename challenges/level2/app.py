"""
NetProbe – Level 2 (WEAKLY PROTECTED)
======================================
This version applies a basic blacklist — blocking semicolons and newlines.
BUT: pipe (|) and logical AND (&&) operators are NOT blocked.
An attacker can bypass this filter easily.

VULNERABILITY: Command Injection via blacklist bypass (| and &&)
"""

import os
from flask import Flask, request, render_template

app = Flask(__name__)

# ==============================================================
# WEAK PROTECTION: Only a few characters are blocked.
# This is the "blacklist" approach — it will ALWAYS be bypassable
# because attackers can always find operators that aren't in the list.
# ==============================================================
BLACKLISTED_CHARS = [';', '\n', '\r']


@app.route('/', methods=['GET', 'POST'])
def index():
    output = None
    error = None

    if request.method == 'POST':
        host = request.form.get('host', '')

        # Check if any blacklisted character is in the input
        if any(char in host for char in BLACKLISTED_CHARS):
            error = "Security Error: Illegal character detected in input."
        else:
            # STILL VULNERABLE: pipe (|) and && operators are not in the blacklist!
            # Example bypass: google.com | cat /flag.txt
            # Example bypass: google.com && cat /flag.txt
            output = os.popen(f'nslookup {host} 2>&1').read()

    return render_template('index.html', output=output, error=error)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

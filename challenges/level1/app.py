"""
NetProbe – Level 1 (FULLY VULNERABLE)
=====================================
This version has NO protection whatsoever.
User input is passed directly into a shell command.

VULNERABILITY: Command Injection via os.popen()
"""

import os
from flask import Flask, request, render_template

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    output = None

    if request.method == 'POST':
        host = request.form.get('host', '')

        # ============================================================
        # VULNERABLE CODE — DO NOT USE IN PRODUCTION
        # User input is injected directly into the shell command.
        # Any shell operator (;, |, &&) will execute additional commands.
        # Example: google.com; cat /flag.txt
        # ============================================================
        output = os.popen(f'nslookup {host} 2>&1').read()

    return render_template('index.html', output=output)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

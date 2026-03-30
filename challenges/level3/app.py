"""
NetProbe – Level 3 (FULLY SECURE)
===================================
This version uses two layers of proper protection:
  1. Whitelist validation — only valid domain/IP formats pass
  2. Safe subprocess execution — no shell=True, args passed as a list

This prevents command injection entirely.

SECURE: No vulnerability present.
"""

import subprocess
import re
from flask import Flask, request, render_template

app = Flask(__name__)


def is_valid_host(host: str) -> bool:
    """
    Whitelist validation: only allow characters that appear in real
    domain names and IP addresses. Rejects anything with shell operators,
    spaces, or special characters.
    """
    if not host or len(host) > 253:
        return False

    # Allow: letters, numbers, hyphens, dots only (RFC 1035 compliant)
    pattern = r'^[a-zA-Z0-9]([a-zA-Z0-9\-\.]*[a-zA-Z0-9])?$'
    return bool(re.match(pattern, host))


@app.route('/', methods=['GET', 'POST'])
def index():
    output = None
    error = None

    if request.method == 'POST':
        host = request.form.get('host', '')

        # ============================================================
        # LAYER 1: Whitelist validation
        # Rejects any input that is not a valid domain/IP format.
        # Special characters like ;, |, &&, spaces are automatically rejected.
        # ============================================================
        if not is_valid_host(host):
            error = "Invalid input: please enter a valid domain name or IP address."
        else:
            # ============================================================
            # LAYER 2: Safe subprocess call (no shell=True)
            # Passing args as a LIST means the OS treats the input as
            # pure data, never as shell commands. No shell interpretation occurs.
            # Even if validation failed somehow, this prevents injection.
            # ============================================================
            try:
                result = subprocess.run(
                    ['nslookup', host],
                    capture_output=True,
                    text=True,
                    timeout=10,
                    shell=False  # Critical: no shell interpretation
                )
                output = result.stdout or result.stderr or "No output returned."
            except subprocess.TimeoutExpired:
                error = "Request timed out. Please try again."
            except Exception:
                error = "An unexpected error occurred."

    return render_template('index.html', output=output, error=error)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)

FROM python:3.11-slim

# Install nslookup (part of dnsutils package)
RUN apt-get update && \
    apt-get install -y dnsutils && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Level 3 has a flag file too, but it is NOT accessible via injection.
# This is here to prove the protection works even when a flag exists.
RUN echo "CTF{n3tpr0b3_l3v3l3_th1s_fl4g_1s_pr0t3ct3d}" > /flag.txt

EXPOSE 5000

CMD ["python", "app.py"]

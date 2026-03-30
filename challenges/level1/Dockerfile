FROM python:3.11-slim

# Install nslookup (part of dnsutils package)
RUN apt-get update && \
    apt-get install -y dnsutils && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create the hidden flag file (this is what attackers need to read)
RUN echo "CTF{n3tpr0b3_l3v3l1_sh3ll_1s_w1d3_0p3n}" > /flag.txt

EXPOSE 5000

CMD ["python", "app.py"]

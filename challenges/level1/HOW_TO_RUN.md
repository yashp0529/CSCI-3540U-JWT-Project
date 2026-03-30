# How to Run – Level 1 (Unprotected)

## Prerequisites
- Docker Desktop installed and running

## Run Command

```bash
docker-compose up --build
```

## Access the App

Open your browser and go to:

```
http://localhost:5001
```

## Stop the App

Press `Ctrl + C` in the terminal, then run:

```bash
docker-compose down
```

## Challenge Goal

Find the flag hidden at `/flag.txt` on the server using command injection.

**Hint:** The app runs `nslookup <your_input>` directly with no filtering.

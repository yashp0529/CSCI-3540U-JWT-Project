# How to Run – Level 2 (Limited Protection)

## Prerequisites
- Docker Desktop installed and running

## Run Command

```bash
docker-compose up --build
```

## Access the App

Open your browser and go to:

```
http://localhost:5002
```

## Stop the App

Press `Ctrl + C` in the terminal, then run:

```bash
docker-compose down
```

## Challenge Goal

Find the flag hidden at `/flag.txt` on the server by **bypassing the input filter**.

**Hint:** The app blocks `;` but not all shell operators.

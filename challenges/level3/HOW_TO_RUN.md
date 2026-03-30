# How to Run – Level 3 (Fully Secured)

## Prerequisites
- Docker Desktop installed and running

## Run Command

```bash
docker-compose up --build
```

## Access the App

Open your browser and go to:

```
http://localhost:5003
```

## Stop the App

Press `Ctrl + C` in the terminal, then run:

```bash
docker-compose down
```

## Note

This version is **fully protected**. Command injection is not possible.
The flag at `/flag.txt` cannot be read through the application.

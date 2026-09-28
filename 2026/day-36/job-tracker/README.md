# Job Tracker

A simple Dockerized full-stack project to track job applications for DevOps roles. It includes:

- React frontend for displaying application stats and job cards
- Flask REST API for serving job data
- PostgreSQL database for storing job records
- Docker Compose setup for local orchestration

## Project Structure

```text
job-tracker/
├── .gitignore
├── docker-compose.yml
├── backend/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── app.py
│   └── requirements.txt
├── database/
│   └── init.sql
├── frontend/
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── index.html
│   ├── package.json
│   ├── nginx/
│   │   └── default.conf
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       └── main.jsx
└── README.md
```

## Tech Stack

- Frontend: React + Vite
- Backend: Python + Flask
- Database: PostgreSQL 16
- Containerization: Docker + Docker Compose

## Application Flow

1. The PostgreSQL database is created using `database/init.sql`.
2. The Flask API connects to PostgreSQL using environment variables.
3. The React frontend fetches job data from the backend at `/api/jobs`.
4. Docker Compose runs all three services together on the same network.

## Database Schema

The database includes a `jobs` table:

```sql
CREATE TABLE IF NOT EXISTS jobs (
    id SERIAL PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL
);
```

Seed data is inserted during database initialization:

- TCS - DevOps Intern - Applied
- Zensar - Cloud Intern - Interview
- Deloitte - DevOps Engineer - Applied

## Backend API

The Flask app exposes the following endpoints:

- `GET /` - app health check message
- `GET /health` - returns `{ "status": "healthy" }`
- `GET /api/db-test` - checks PostgreSQL connectivity
- `GET /api/jobs` - returns all jobs in the database

## Frontend Features

The React app shows:

- total application count
- number of applications with `Applied` status
- number of applications with `Interview` status
- job cards showing company and role

## Environment Variables

Create a `.env` file in the project root before running Docker Compose:

```env
POSTGRES_DB=jobtracker
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
```

The backend reads these values using `DB_HOST`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_PORT`.

## Running the Project

From the project root:

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000
- Database: internal Docker network only

To stop the containers:

```bash
docker compose down
```

To remove the database volume:

```bash
docker compose down -v
```

## Notes

- The frontend is served by Nginx in Docker.
- The backend and frontend are connected through the internal Docker network.
- `.env` is ignored by Git via `.gitignore`.

## Author

This project is part of the 90DaysOfDevOps challenge and demonstrates a simple DevOps job tracker using Docker, React, Flask, and PostgreSQL.

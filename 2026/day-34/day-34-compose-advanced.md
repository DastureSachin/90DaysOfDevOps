# Day 34 – Docker Compose: Real-World Multi-Container Apps

## Stack

This exercise runs a three-service application with Docker Compose:

- Node.js and Express web application
- PostgreSQL database
- Redis cache

The application connects to PostgreSQL through the Compose service name `db` and to Redis through `redis`.

## Start the stack

Copy `.env.example` to `.env` and set appropriate values:

```bash
cp .env.example .env
docker compose config
docker compose up --build -d
```

Open `http://localhost:5000` and check the health endpoint:

```bash
curl http://localhost:5000/health
docker compose ps
docker compose logs -f app
```

## Healthchecks and dependencies

PostgreSQL uses `pg_isready` as a healthcheck. The application uses:

```yaml
depends_on:
  db:
    condition: service_healthy
```

This makes Compose wait for PostgreSQL readiness rather than only container startup.

## Restart policies

- `restart: always` restarts a long-running service regardless of exit status.
- `restart: on-failure` restarts only when the process exits unsuccessfully.
- `restart: unless-stopped` restarts services unless manually stopped.
- `restart: no` is useful while debugging.

The database uses `restart: always` in the example.

## Custom Dockerfile

The app is built from `app/Dockerfile` using:

```yaml
build:
  context: ./app
```

After changing application code, rebuild and restart it with:

```bash
docker compose up --build -d
```

## Networks, volumes, and labels

The services use the explicit `3-tier` bridge network. PostgreSQL data is stored in the named `db_data` volume, so it survives container recreation:

```bash
docker compose down
docker compose up -d
```

Do not use `docker compose down -v` when testing persistence because it deletes the named volume.

Labels identify each service as `web`, `database`, or `cache`.

## Scaling experiment

Try:

```bash
docker compose up --scale app=3 -d
```

Because every replica attempts to bind the same host port, additional replicas cannot start with the fixed mapping `${APP_PORT}:3000`. In production, replicas normally sit behind a load balancer or reverse proxy.

## Useful commands

```bash
docker compose ps
docker compose logs
docker compose logs app
docker compose exec db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
docker compose down
docker compose down -v
```

## What I learned

Docker Compose can manage an application, database, and cache as one reproducible stack. Healthchecks improve startup ordering, restart policies improve resilience, named volumes preserve data, explicit networks enable service discovery, and labels provide useful metadata.

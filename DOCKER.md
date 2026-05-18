# Docker — Dolibarr Modern Frontend

Single-container Laravel 12 + Vue 3 frontend for a Dolibarr instance. The
container is stateless, multi-arch (`linux/amd64`, `linux/arm64`), and ready
for Docker Hub.

## Requirements

- Docker Engine **24+** (Compose v2)
- A reachable Dolibarr API URL and admin API key

## Quick start

```bash
git clone https://github.com/cehojac/dolibarr-modern-frontend.git
cd dolibarr-modern-frontend
cp .env.docker.example .env.docker
# Edit DOLIBARR_BASE_URL and DOLIBARR_API_KEY in .env.docker
docker compose up -d --build
```

Open <http://localhost:8080>.

Change the host port via `APP_PORT` in `.env.docker` (defaults to `8080`).

## Required environment variables

| Variable             | Required | Example                                                   |
| -------------------- | -------- | --------------------------------------------------------- |
| `DOLIBARR_BASE_URL`  | yes      | `https://erp.example.com/api/index.php`                   |
| `DOLIBARR_API_KEY`   | yes      | (Dolibarr user → Set up → API key)                        |
| `DOLIBARR_VERIFY_SSL`| no       | `true` (default) — set to `false` for self-signed certs   |
| `APP_URL`            | no       | `http://localhost:8080` — must match the public URL       |
| `APP_PORT`           | no       | `8080` — host port for the compose mapping                |

All other Laravel variables have sensible defaults and rarely need changes
for a single-container deployment.

## What the image contains

| Stage      | Base image               | Output                                  |
| ---------- | ------------------------ | --------------------------------------- |
| `assets`   | `node:20-alpine`         | Compiled Vite bundle (`public/build`)   |
| `vendor`   | `composer:2`             | Production Composer vendor              |
| `runtime`  | `php:8.3-apache-bookworm`| Final image (~208 MB content)           |

Runtime PHP extensions installed: `mbstring`, `xml`, `pdo`, `pdo_sqlite`,
`opcache`, `zip`. The Dolibarr proxy uses Laravel's HTTP client (curl-based)
out of the box.

## Persistence

Three named volumes survive container recreation:

| Volume                 | Mount point                              | Purpose                                  |
| ---------------------- | ---------------------------------------- | ---------------------------------------- |
| `app_storage`          | `/var/www/html/storage`                  | Logs, sessions, cache, persisted APP_KEY |
| `app_bootstrap_cache`  | `/var/www/html/bootstrap/cache`          | Compiled config/route/view caches        |
| `app_database`         | `/var/www/html/database`                 | SQLite database for app sessions/cache   |

`APP_KEY` is generated on first boot and persisted in
`storage/app_key`, so sessions remain valid across restarts.

## Operations

```bash
# View logs
docker compose logs -f app

# Restart (re-applies .env.docker changes; rebuilds config cache)
docker compose restart app

# Rebuild after code changes
docker compose up -d --build

# Wipe everything (including persisted APP_KEY and DB)
docker compose down -v

# Open a shell inside the container
docker compose exec app bash

# Re-check cached Laravel config
docker compose exec app php artisan config:show services.dolibarr
```

## Health check

The image ships with an `HEALTHCHECK` that hits `/up` every 30 s. Compose
shows `(healthy)` in `docker ps` once it passes. Same probe is configured
in `docker-compose.yml` for orchestrators that don't honor image-level
health checks.

## Publishing to Docker Hub

```bash
# One-time: enable buildx and create a multi-arch builder
docker buildx create --name multiarch --use

# Build and push amd64 + arm64
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t cehojac/dolibarr-modern-frontend:latest \
  -t cehojac/dolibarr-modern-frontend:$(git rev-parse --short HEAD) \
  --push .
```

For a single-arch push (current host arch):

```bash
docker login
docker push cehojac/dolibarr-modern-frontend:latest
```

## Reverse proxy / TLS

The container only serves plain HTTP on port 80 internally. Terminate TLS
upstream (Nginx, Traefik, Caddy, Cloudflare, Plesk…). Forward all traffic
to the container port and set `APP_URL` to the public HTTPS URL.

Example Traefik labels:

```yaml
services:
  app:
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`frontend.example.com`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=letsencrypt"
      - "traefik.http.services.frontend.loadbalancer.server.port=80"
```

## Troubleshooting

| Symptom                                       | Fix                                                                                       |
| --------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `"Acceso Bloqueado"` on login                 | `DOLIBARR_API_KEY` wrong or empty. Verify with `docker compose exec app php artisan config:show services.dolibarr`. |
| Login page loads but `/api/doli/*` returns 401| Session lost (cleared volumes) or proxy unable to reach Dolibarr. Check `docker compose logs app`. |
| `Please provide a valid cache path`           | Volumes not writable. Recreate with `docker compose down -v && docker compose up -d`.     |
| Port conflict on 8080                         | Set `APP_PORT=8090` (or any free port) in `.env.docker`.                                  |
| SSL handshake fails calling Dolibarr          | Set `DOLIBARR_VERIFY_SSL=false` for self-signed certs in dev.                              |

## File layout

```text
.
├── Dockerfile                # 3-stage build (assets → vendor → runtime)
├── docker-compose.yml        # Single-service compose with named volumes
├── .dockerignore             # Build context filter
├── .env.docker.example       # Template; copy to .env.docker
└── docker/
    ├── init.sh               # ENTRYPOINT: bootstraps Laravel, then execs CMD
    └── apache/
        └── 000-default.conf  # Minimal vhost — defers to public/.htaccess
```

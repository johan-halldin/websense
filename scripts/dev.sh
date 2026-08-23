#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "No .env found, copying .env.example -> .env"
  cp .env.example .env
fi

set -a
source .env
set +a

docker compose up -d

echo "Waiting for database..."
until docker compose exec -T timescaledb pg_isready -U postgres -d websense >/dev/null 2>&1; do
  sleep 1
done

for attempt in 1 2 3 4 5; do
  if pnpm db:migrate; then
    break
  fi
  echo "Migration attempt $attempt failed, retrying..."
  sleep 1
done

pnpm --parallel --filter @websense/server --filter @websense/client run dev

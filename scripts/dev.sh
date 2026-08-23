#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -f .env ]; then
  echo "Missing .env (copy .env.example -> .env first)" >&2
  exit 1
fi

set -a
source .env
set +a

docker compose up -d

until docker compose exec -T timescaledb pg_isready -U postgres -d websense >/dev/null 2>&1; do
  sleep 1
done

pnpm db:migrate

pnpm --parallel --filter @websense/server --filter @websense/client run dev

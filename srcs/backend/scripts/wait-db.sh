#!/usr/bin/env sh

set -e # Exit immediately if a command exits with a non-zero status.

until nc -z $POSTGRES_HOST $POSTGRES_PORT
do
  echo "$(date) - waiting for database $POSTGRES_HOST:$POSTGRES_PORT..."
  sleep 2
done

>&2 echo "Postgres is up - continuing..."

# npx prisma migrate deploy
npx prisma generate
npm run build

node dist/main.js
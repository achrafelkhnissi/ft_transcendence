#!/usr/bin/env sh

set -e # Exit immediately if a command exits with a non-zero status.

export PATH="/app/node_modules/.bin:$PATH"

# Wait for postgres to be ready
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
do
  echo "$(date) - waiting for database $POSTGRES_HOST:$POSTGRES_PORT..."
  sleep 2
done

>&2 echo "Postgres is up - continuing..."

# TODO: Why does prisma is not installed? even after running `RUN npm install` in Dockerfile
if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode"
  npx prisma migrate deploy
else
  ls -la
  echo "Running in development mode"
  npx prisma db push # --no-install # --skip-generate
fi

npx prisma studio --port 5555 &

exec "$@"

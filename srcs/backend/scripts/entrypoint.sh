#!/usr/bin/env sh

set -e # Exit immediately if a command exits with a non-zero status.

if [ ! -d "node_modules" ]; then
  echo "node_modules not found. Installing..."
  npm install
fi

until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
do
  echo "$(date) - waiting for database $POSTGRES_HOST:$POSTGRES_PORT..."
  sleep 2
done

>&2 echo "Postgres is up - continuing..."

npx prisma db push

if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode"
  ls -la 
  npx prisma generate
  npx nest build
fi

npx prisma studio --port 5555 &

exec "$@"

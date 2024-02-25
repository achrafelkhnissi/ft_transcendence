#!/usr/bin/env sh

set -e # Exit immediately if a command exits with a non-zero status.

if [ "$NODE_ENV" = "development" ]; then
  echo "Installing dev dependencies..."
  npm install
  echo "Dev dependencies installed."
fi

until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
do
  echo "$(date) - waiting for database $POSTGRES_HOST:$POSTGRES_PORT..."
  sleep 2
done

>&2 echo "Postgres is up - continuing..."

npx prisma db push
npx prisma studio --port 5555 &

exec "$@"

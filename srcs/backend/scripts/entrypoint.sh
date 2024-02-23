#!/usr/bin/env sh

set -e # Exit immediately if a command exits with a non-zero status.

until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
do
  echo "$(date) - waiting for database $POSTGRES_HOST:$POSTGRES_PORT..."
  sleep 2
done

>&2 echo "Postgres is up - continuing..."

if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode"
  npx prisma migrate dev --name init
  npx prisma generate
  npm run build
else
  echo "Running in development mode"
  npx prisma db push
fi

npx prisma studio --port 5555 &

exec "$@"

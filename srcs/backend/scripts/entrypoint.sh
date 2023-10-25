#!/usr/bin/env sh

# Wait for postgres to be ready
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
do
  echo "$(date) - waiting for database $POSTGRES_HOST:$POSTGRES_PORT..."
  sleep 2
done

npm run prisma:migrate
npm run prisma:generate
npm run prisma:seed
npm run prisma:studio

exec "$@"



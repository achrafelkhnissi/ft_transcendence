#!/usr/bin/env sh

# Wait for postgres to be ready
until pg_isready -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER
do
  echo "$(date) - waiting for database $POSTGRES_HOST:$POSTGRES_PORT..."
  sleep 2
done

>&2 echo "Postgres is up - continuing..."

# Check if node_env is production
if [ "$NODE_ENV" = "production" ]; then
  echo "Running in production mode"
  npx prisma migrate deploy
else
  echo "Running in development mode"
  npx prisma db push
fi

npx prisma studio --port 5555 &

exec "$@"

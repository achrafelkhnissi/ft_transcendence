#!/usr/bin/env sh

set -e

cmd="$@"

echo "Node env: $NODE_ENV"

# Note: node_env should be passed as an environment variable
if [ "$NODE_ENV" = "development" ]; then
  echo "Running in development mode - Installing dependencies for hot reload"
  npm install
fi

# Check if the nestjs application is running before starting the frontend container
# until curl --output /dev/null --silent --head --fail "http://$host/authors"; do
until curl --output /dev/null --silent --head --fail "$BACKEND_HOST:$NEST_PORT/api"; do
  >&2 echo "NestJS application is unavailable on $BACKEND_HOST:$NEST_PORT - sleeping.."
  sleep 1
done

>&2 echo "Backend is up - executing command $cmd"
exec $cmd
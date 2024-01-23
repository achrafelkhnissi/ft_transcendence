#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

# Check if the nestjs application is running on port 3000 before starting the frontend container
until curl --output /dev/null --silent --head --fail "http://$host/api"; do
  >&2 echo "NestJS application is unavailable on port 3000 - sleeping"
  sleep 1
done

>&2 echo "Backend is up - executing command"
exec $cmd
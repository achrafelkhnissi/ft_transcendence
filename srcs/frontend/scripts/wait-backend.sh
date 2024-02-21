#!/bin/bash

set -e

host="$1"
shift
cmd="$@"

# Check if the nestjs application is running before starting the frontend container
until curl --output /dev/null --silent --head --fail "http://$host/api"; do
  >&2 echo "NestJS application is unavailable on $host - sleeping.."
  sleep 1
done

>&2 echo "Backend is up - executing command $cmd"
exec $cmd
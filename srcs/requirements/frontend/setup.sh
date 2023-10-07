#!/usr/bin/env bash

docker build -t frontend .
docker run --rm -it --mount type=bind,source="$(pwd)",target=/app -d -p 1337:1337 --name frontend frontend bash
docker exec frontend sh -c "echo 'export NEXTJS_PORT=1337' >> ~/.bashrc"
docker exec frontend sh -c "source ~/.bashrc"
docker exec frontend sh -c "npm install && npm run dev"

# echo 'export NEXTJS_PORT=1337' >> ~/.bashrc && source ~/.bashrc

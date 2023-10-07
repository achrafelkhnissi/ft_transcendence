#!/usr/bin/env bash

docker rm ${docker ps -a -q}
docker build -t frontend .
docker run --rm -it --mount type=bind,source="$(pwd)",target=/app -d -p 1337:1337 --name frontend frontend bash
docker exec frontend sh -c "npm install"
docker exec frontend sh -c "echo 'export NEXTJS_PORT=1337' >> ~/.bashrc && source ~/.bashrc"

# echo 'export NEXTJS_PORT=1337' >> ~/.bashrc && source ~/.bashrc

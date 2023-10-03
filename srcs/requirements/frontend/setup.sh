#!/usr/bin/env bash

docker rm ${docker ps -a -q}
docker build -t frontend .
docker run --mount  type=bind,source="$(pwd)",target=/app -d -p 1337:1337 --name frontend frontend

# echo 'export NEXTJS_PORT=1337' >> ~/.bashrc && source ~/.bashrc

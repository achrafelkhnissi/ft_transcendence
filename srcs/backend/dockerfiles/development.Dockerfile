#
# 🧑‍💻 Development
#
FROM node:20-alpine

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

ENV NODE_ENV development

WORKDIR /app

RUN apk add --no-cache postgresql-client && \
    rm -rf /var/cache/apk/*

COPY . .

EXPOSE 3000 5555

ENTRYPOINT [ "sh", "./scripts/entrypoint.sh" ]
CMD [ "npm", "run", "start:dev" ]
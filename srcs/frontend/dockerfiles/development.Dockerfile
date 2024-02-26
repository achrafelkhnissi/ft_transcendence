#
# 🧑‍💻 Development
#
FROM node:20-alpine

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

ARG BACKEND_SERVICE
ENV BACKEND_SERVICE $BACKEND_SERVICE
ENV NODE_ENV development

RUN apk add --no-cache libc6-compat curl

WORKDIR /app

COPY . .

EXPOSE 1337

ENTRYPOINT [ "sh", "./scripts/entrypoint.sh" ]
CMD ["npm", "run", "dev"]
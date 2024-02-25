#
# 🧑‍💻 Development
#
FROM node:20-alpine as dev

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

ENV NODE_ENV development

WORKDIR /app

RUN apk add --no-cache postgresql-client && \
    rm -rf /var/cache/apk/* && \
    chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install --verbose prisma @nestjs/cli 

COPY --chown=node:node . .

EXPOSE 3000 5555

ENTRYPOINT [ "sh", "./scripts/entrypoint.sh" ]
CMD [ "npm", "run", "start:dev" ]

#
# 🚀 Production Build
#
FROM node:20-alpine as build

WORKDIR /app

ENV NODE_ENV production

COPY --chown=node:node --from=dev /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npx prisma generate
RUN npm run build

RUN npm ci --omit=dev --verbose

USER node

#
# 🚀 Production Server
#
FROM node:20-alpine as prod

ARG POSTGRES_HOST
ARG POSTGRES_PORT
ENV POSTGRES_HOST $POSTGRES_HOST
ENV POSTGRES_PORT $POSTGRES_PORT
ENV NODE_ENV production

# Add glibc compatibility for alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules
COPY --chown=node:node --from=build /app/uploads uploads
COPY --chown=node:node --from=build /app/prisma prisma

USER node

CMD until nc -z $POSTGRES_HOST $POSTGRES_PORT; \
  do echo "Waiting for database connection..."; \
  sleep 2; \
  done && \ 
  # TODO: prisma not installed here! Why?
  npx prisma db push && \
  node dist/main.js

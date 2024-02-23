#
# 🧑‍💻 Development
#
FROM node:20-alpine as dev

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

# ARG NODE_ENV
# ENV NODE_ENV ${NODE_ENV:-development}

WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache postgresql-client && \
    rm -rf /var/cache/apk/* && \
    npm install -g npm@10.4.0 && \
    # npm install -g @nestjs/cli # Needed in prod to run `nest build` and compose target: dev
    chown -R node:node /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000 5555

ENTRYPOINT [ "sh", "./scripts/entrypoint.sh" ]
CMD [ "npm", "run", "start:dev" ]

#
# 🚀 Production Build
#
FROM node:20-alpine as build

WORKDIR /app
RUN apk add --no-cache libc6-compat && \
    npm install -g npm@10.4.0

ENV NODE_ENV production

COPY --chown=node:node --from=dev /app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npx prisma generate
RUN npm run build

RUN npm ci --omit=dev && npm cache clean --force

USER node

#
# 🚀 Production Server
#
FROM node:20-alpine as prod

WORKDIR /app

# Add glibc compatibility for alpine
RUN apk add --no-cache libc6-compat netcat-openbsd

ENV NODE_ENV production

COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules

RUN mkdir -p /app/uploads && chown -R node:node /app/uploads

USER node

# FIXME: Need to generate/deploy primsa schema before running the server
CMD sh -c 'until nc -z db 5432; do sleep 1; done; node dist/main.js'
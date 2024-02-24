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

RUN npm install --verbose 

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

WORKDIR /app

# Add glibc compatibility for alpine
RUN apk add --no-cache libc6-compat

ENV NODE_ENV production

COPY --chown=node:node --from=build /app/dist dist
COPY --chown=node:node --from=build /app/node_modules node_modules
COPY --chown=node:node --from=build /app/uploads uploads

USER node

CMD until nc -z db 5432; do echo "Waiting for database connection..."; sleep 2; done && node dist/main.js

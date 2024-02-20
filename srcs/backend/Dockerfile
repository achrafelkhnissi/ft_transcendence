#
# 🧑‍💻 Development
#
FROM node:21-alpine as dev

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV:-development}

WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache postgresql-client

RUN chown -R node:node /app

COPY --chown=node:node . .

RUN npm install

EXPOSE 3000 5555

USER node

ENTRYPOINT [ "sh", "./scripts/entrypoint.sh" ]
CMD [ "npm" , "run", "start:dev" ]

# # 🏡 Production Build
# #
# FROM node:21-alpine as build

# WORKDIR /app
# RUN apk add --no-cache libc6-compat

# # Set to production environment
# ENV NODE_ENV production

# # In order to run `yarn build` we need access to the Nest CLI.
# # Nest CLI is a dev dependency.
# COPY --chown=node:node --from=dev /app/node_modules ./node_modules
# # Copy source code
# COPY --chown=node:node . .

# # Generate the production build. The build script runs "nest build" to compile the application.
# RUN npm run build

# # Install only the production dependencies and clean cache to optimize image size.
# RUN npm ci --omit=dev && npm cache clean --force

# # Set Docker as a non-root user
# USER node

# #
# # 🚀 Production Server
# #
# FROM node:21-alpine as prod

# WORKDIR /app
# RUN apk add --no-cache libc6-compat

# # Set to production environment
# ENV NODE_ENV production

# # Copy only the necessary files
# COPY --chown=node:node --from=build /app/dist dist
# COPY --chown=node:node --from=build /app/node_modules node_modules

# # Set Docker as non-root user
# USER node

# CMD ["node", "dist/main.js"]
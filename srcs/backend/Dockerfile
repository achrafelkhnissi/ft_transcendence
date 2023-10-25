#
# 🧑‍💻 Development
#
FROM node:20-alpine as dev

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

ENV NODE_ENV development

# TODO: Add the following environment variables
# ARG NEST_PORT
# ARG PRISMA_STUDIO_PORT

# TODO: remove the following line
RUN apk update && apk add postgresql

USER node

WORKDIR /app

RUN chown -R node:node /app

COPY --chown=node:node . .

EXPOSE 3000 5555

CMD ["npm", "run", "start:dev"]

#
# 🧑‍💻 Development
#
FROM node:20-alpine as dev

ENV NODE_ENV development

RUN apk update && apk add postgresql

# USER node

WORKDIR /app

RUN chown -R node:node /app

COPY --chown=node:node . .

# RUN npm install && chmod +x ./scripts/entrypoint.sh

EXPOSE 3000 5555

# ENTRYPOINT [ "sh", "./scripts/entrypoint.sh" ]
CMD ["npm", "run", "start:dev"]

#
# 🧑‍💻 Development
#
FROM node:20

ENV NODE_ENV development

WORKDIR /app

RUN chown -R node:node /app

USER node

COPY --chown=node:node . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

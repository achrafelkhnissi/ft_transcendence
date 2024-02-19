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

# FROM node:20 AS dev

# ARG NODE_ENV
# ENV NODE_ENV development

# WORKDIR /app

# RUN chown -R node:node /app

# COPY  --chown=node:node . .

# USER node

# RUN npm install

# # Stage 2: Build
# FROM node:20 AS build

# ARG BACKEND
# ENV BACKEND $BACKEND

# WORKDIR /app

# COPY --from=dev /app/node_modules ./node_modules
# COPY src ./src
# COPY public ./public
# COPY package.json next.config.js tsconfig.json ./

# RUN npm run build

# # Stage 3: Production
# FROM node:20-alpine AS prod

# WORKDIR /app

# COPY --from=build /app/.next ./.next
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/package.json ./package.json
# COPY --from=build /app/public ./public

# CMD ["npm", "run", "start"]
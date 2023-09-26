#
# 🧑‍💻 Development
#
FROM node:20

ENV NODE_ENV development

# Install nextjs dependencies
RUN apt update && npm install -g npm@10.1.0

# USER node

WORKDIR /app

# RUN chown -R node:node /app

# COPY --chown=node:node package.json package-lock.json ./
# COPY package.json ./
# RUN npm install

# COPY --chown=node:node . .
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

#
# 🧑‍💻 Development
#
FROM node:20-alpine as dev

# Set to dev environment
ENV NODE_ENV development

# Create app folder
WORKDIR /app

# Set permissions for node user to /app directory
RUN chown -R node:node /app

# Copy source code into app folder
COPY --chown=node:node . .

# Install dependencies
RUN npm install

# Expose port 3000
EXPOSE 3000

# Set Docker as a non-root user
USER node

# Run the app
CMD ["npm", "run", "start:dev"]

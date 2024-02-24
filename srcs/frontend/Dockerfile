#
# 🧑‍💻 Development
#
# FROM node:20-alpine as dev

# LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

# ARG BACKEND_HOST
# ARG BACKEND
# ARG NEST_PORT
# ENV BACKEND_HOST $BACKEND_HOST
# ENV NEST_PORT $NEST_PORT
# ENV BACKEND $BACKEND

# RUN apk add --no-cache libc6-compat curl

# WORKDIR /app

# COPY package*.json ./

# RUN npm install --verbose

# COPY . .

# COPY scripts/wait-backend.sh ./scripts/wait-backend.sh
# RUN chmod +x ./scripts/wait-backend.sh

# ENV NODE_ENV production

# RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

# EXPOSE 1337

# ENTRYPOINT [ "sh", "./scripts/wait-backend.sh" ]
# CMD ["npm", "run", "start"]
FROM node:20-alpine as dev

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install

# 
# ⚙️ Build
#
FROM node:20-alpine AS build

ARG BACKEND
ENV NODE_ENV production
ENV NEXT_PUBLIC_BACKEND ${BACKEND:-http://localhost:3000}
ENV BACKEND ${BACKEND:-http://localhost:3000}

WORKDIR /app

COPY --from=dev /app/node_modules ./node_modules
COPY . .

RUN npm run build

#
# 🚀 Production
#
FROM node:20-alpine AS prod

ARG BACKEND
ARG PORT
ARG HOSTNAME
ARG NEXT_PUBLIC_BACKEND
ENV BACKEND ${BACKEND:-http://localhost:3000}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME "0.0.0.0"
ENV PORT ${PORT:-1337}
ENV NEXT_PORT ${PORT:-1337}
ENV NEXT_PUBLIC_BACKEND $NEXT_PUBLIC_BACKEND

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=build /app/public ./public

RUN mkdir .next
RUN chown -R nextjs:nodejs /app/.next

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

EXPOSE 1337

CMD ["node", "server.js"]
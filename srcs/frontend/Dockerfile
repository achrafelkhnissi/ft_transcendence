#
# 🧑‍💻 Development
#
FROM node:20-alpine as dev

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install --verbose

# 
# ⚙️ Build
#
FROM node:20 AS build

ENV NODE_ENV production

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
ENV BACKEND $BACKEND
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME $HOSTNAME
ENV PORT ${PORT:-1337}

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=build /app/public ./public

RUN mkdir .next
RUN chown -R nextjs:nodejs /app/.next

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 1337

CMD ["node", "server.js"]
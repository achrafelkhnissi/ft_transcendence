#
# 📦 Dependencies
#
FROM node:20-alpine as deps

LABEL maintainer="Achraf El Khnissi <achraf.elkhnissi@gmail.com>"

ENV NODE_ENV development

RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g sharp

# 
# ⚙️ Build
#
FROM node:20-alpine AS build

ARG BACKEND
ARG DOMAIN_NAME
ARG JWT_SECRET
ENV DOMAIN_NAME ${DOMAIN_NAME}
ENV JWT_SECRET ${JWT_SECRET}
ENV BACKEND ${BACKEND}
ENV NODE_ENV production

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

#
# 🚀 Production
#
FROM node:20-alpine AS prod

ARG BACKEND
ARG PORT
ENV BACKEND ${BACKEND}
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME "0.0.0.0"
ENV PORT ${PORT:-1337}
ENV NEXT_SHARP_PATH=/usr/local/lib/node_modules/sharp

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=deps --chown=nextjs:nodejs /usr/local/lib/node_modules/sharp /usr/local/lib/node_modules/sharp

COPY --from=build /app/public ./public

RUN mkdir .next
RUN chown -R nextjs:nodejs /app/.next

COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 1337

CMD ["node", "server.js"]
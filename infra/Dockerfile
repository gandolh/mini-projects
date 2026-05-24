# Multi-stage build for the npm-workspaces monorepo (client + server).
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json ./client/
COPY server/package.json ./server/
RUN npm ci

FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules
COPY package.json package-lock.json ./
COPY client ./client
COPY server ./server
RUN npm run build --workspace client \
 && npm run build --workspace server

FROM node:24-alpine AS runtime
RUN apk add --no-cache git
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/
RUN npm ci --omit=dev --workspace server --include-workspace-root

COPY --from=build /app/server/dist ./server/dist
COPY --from=build /app/client/dist ./public

ENV NODE_ENV=production
ENV PORT=3020
ENV CLIENT_DIST=/app/public
EXPOSE 3020

CMD ["node", "server/dist/index.js"]

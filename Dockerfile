FROM node:24.14.0-alpine3.22 AS base
WORKDIR /app
RUN apk upgrade --no-cache

FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN npm ci

FROM deps AS build
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src
COPY scripts ./scripts
COPY env ./env
RUN npm run build

FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache bash

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./
COPY --from=build --chown=node:node /app/scripts ./scripts
COPY --from=build --chown=node:node /app/env ./env
COPY --from=deps --chown=node:node /app/package.json ./
COPY --from=deps --chown=node:node /app/prisma.config.ts ./

RUN chmod +x scripts/docker-entrypoint.sh

EXPOSE 3000

USER node

CMD ["bash", "/app/scripts/docker-entrypoint.sh"]

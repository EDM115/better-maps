FROM node:23-alpine AS builder

ARG PORT=27400
ENV PORT=${PORT}
ENV NODE_ENV=development

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache bash ca-certificates && \
    update-ca-certificates && \
    corepack disable yarn && \
    npm uninstall -g corepack

SHELL ["/bin/bash", "-c"]

WORKDIR /app/

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:/app/node_modules/.bin:$PATH

RUN PNPM_VERSION=$(grep '"packageManager":' package.json | sed -E 's/.*"pnpm@([^"]+)".*/\1/') && \
    wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" PNPM_VERSION=$PNPM_VERSION bash -

RUN pnpm i

COPY . /app/
COPY .env /app/.env

ENV NODE_ENV=production

RUN mkdir -p db && \
    sed -i 's/SEED=false/SEED=true/' .env && \
    dotenv -- node --experimental-strip-types init/seed_db.ts && \
    rm -fr init

RUN pnpm build

###

FROM node:23-alpine

LABEL org.opencontainers.image.authors="EDM115 <dev@edm115.dev>"
LABEL org.opencontainers.image.base.name="node:23-alpine"
LABEL org.opencontainers.image.licenses="MIT"
LABEL org.opencontainers.image.source="https://github.com/EDM115-org/better-maps.git"
LABEL org.opencontainers.image.title="Better Maps"
LABEL org.opencontainers.image.url="https://github.com/EDM115-org/better-maps"

ARG PORT=27400
ENV PORT=${PORT}
ENV NODE_ENV=production

RUN apk update && \
    apk upgrade --no-cache && \
    apk add --no-cache bash sqlite && \
    corepack disable yarn && \
    npm uninstall -g corepack

SHELL ["/bin/bash", "-c"]

WORKDIR /app/

COPY package.json ./

ENV PNPM_HOME=/root/.local/share/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN PNPM_VERSION=$(grep '"packageManager":' package.json | sed -E 's/.*"pnpm@([^"]+)".*/\1/') && \
    wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" PNPM_VERSION=$PNPM_VERSION bash - && \
    pnpm add -g dotenv-cli && \
    pnpm store prune

COPY --from=builder /app/.output /app/.output
COPY --from=builder /app/db /app/db
COPY --from=builder /app/.env /app/.env

VOLUME ["/app/db"]

EXPOSE ${PORT}

ENTRYPOINT ["dotenv", "--"]
CMD ["node", "/app/.output/server/index.mjs"]

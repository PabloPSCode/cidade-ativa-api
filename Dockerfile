# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:22-slim AS builder

# Prisma needs openssl to generate/run its engine.
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install all deps (incl. dev) so we can build and generate the Prisma client.
COPY package*.json ./
RUN npm ci

# Generate the Prisma client, then build the Nest app.
COPY prisma ./prisma
RUN npx prisma generate

COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM node:22-slim AS runner

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
WORKDIR /app

# Copy the full dependency tree (includes the generated Prisma client and the
# Prisma CLI needed to run `migrate deploy` at startup).
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY package*.json prisma.config.ts ./

EXPOSE 3337

# Apply pending migrations, then boot the API (startup seeds run in main.ts).
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]

# Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# Run
FROM node:20-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las deps (incl. prisma CLI para migrate deploy al arrancar)
RUN npm ci
RUN npx prisma generate

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/index.js"]

# Build: compilar con Vite (VITE_API_URL se pasa en docker-compose)
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Run: servir estáticos con nginx
FROM nginx:alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

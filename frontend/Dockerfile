# Etapa 1: build (Vite -> dist)
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent || npm install --silent
COPY . .
RUN npm run build  # Vite genera /app/dist

# Etapa 2: servir estáticos con Nginx
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

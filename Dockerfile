# Etapa 1: Compilación de Angular
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production --project motor-markt

# Etapa 2: Servir con NGINX
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/motor-markt /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
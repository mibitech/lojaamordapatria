# Dockerfile para aplicação React (Vite)
FROM node:20-alpine AS build
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY bun.lockb ./

# Instalar dependências
RUN npm ci 

# Copiar código fonte
COPY . .

# Copiar arquivo .env para build
COPY .env .env

# Build da aplicação
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

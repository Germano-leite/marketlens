# ==========================================
# ESTÁGIO 1: Build do React (Node.js)
# ==========================================
FROM node:18-alpine as build

WORKDIR /app

# Copia os arquivos de dependência primeiro
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia todo o código fonte
COPY . .

# Gera a pasta 'dist' com os arquivos otimizados para produção
RUN npm run build

# ==========================================
# ESTÁGIO 2: Servidor Web (Nginx)
# ==========================================
FROM nginx:alpine

# Copia os arquivos gerados no estágio anterior para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copia nossa configuração personalizada do Nginx (vamos criar esse arquivo já já)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (padrão web)
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
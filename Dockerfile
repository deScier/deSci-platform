FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o restante do código da aplicação
COPY . .

# Construir a aplicação (se necessário)
RUN npm run build

# Expor a porta da aplicação
EXPOSE 3000

# Copiar o script de entrypoint
COPY entrypoint.sh /app/entrypoint.sh

# Dar permissão executável ao script de entrypoint
RUN chmod +x /app/entrypoint.sh

# Usar um usuário não root para maior segurança
USER node

# Definir o entrypoint
ENTRYPOINT ["/app/entrypoint.sh"]

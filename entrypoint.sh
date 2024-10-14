#!/bin/sh

# Escrever o conteúdo da variável de ambiente ENV_FILE em um arquivo .env
echo "$ENV_FILE" > .env

# Iniciar a aplicação
npm start
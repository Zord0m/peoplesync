# Usa a imagem oficial Node
FROM node:18

# Define o diretório da aplicação dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia todo o restante da aplicação
COPY . .

# Expõe a porta correta do backend
EXPOSE 3000

# Comando padrão: inicia em modo desenvolvimento
CMD ["npm", "run", "dev"]

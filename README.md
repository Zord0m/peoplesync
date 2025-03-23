# 📌 PeopleSync - Sistema de Registro de Ponto

PeopleSync é uma aplicação web para registro e gerenciamento de ponto dos funcionários, integrando frontend, backend, banco de dados MySQL e automação via **n8n**.

---

## 📌 1️⃣ Pré-requisitos

Antes de iniciar a aplicação, certifique-se de ter instalado:

- **[Docker](https://www.docker.com/)** e **Docker Compose**
- **[Node.js](https://nodejs.org/en/)** (se for rodar localmente sem Docker)
- **[DBeaver](https://dbeaver.io/)** (Opcional, para acessar o banco de dados MySQL)

---

## 📌 2️⃣ Clonando o Repositório

Para começar, clone este repositório:

```sh
git clone https://github.com/Zord0m/peoplesync.git
cd peoplesync
```

---

## 📌 3️⃣ Configuração do Arquivo `.env`

O arquivo `.env` **não está incluído no repositório** por questões de segurança.  
Você **deve solicitar um arquivo `.env` e colocá-lo na pasta `backend/`**.

---

## 📌 4️⃣ Subindo os Containers com Docker

Para iniciar todos os serviços (frontend, backend, banco de dados e n8n), rode:

```sh
docker-compose up -d --build
```

Isso irá:

- Criar e iniciar os containers do **backend**, **frontend**, **MySQL** e **n8n**.
- Configurar a rede entre os serviços.
- Persistir os dados do MySQL usando volumes.

**Para verificar se os containers estão rodando:**

```sh
docker ps
```

Se precisar parar todos os containers:

```sh
docker-compose down
```

---

## 📌 5️⃣ Acessando a Aplicação

Após iniciar os containers, acesse os serviços nos seguintes links:

### 🔹 Frontend (Interface do Usuário)
📍 [http://localhost:8080](http://localhost:8080)

### 🔹 Backend (API REST)
📍 [http://localhost:4444](http://localhost:4444)  
Se não houver uma rota `/`, a API pode retornar um erro **"Cannot GET /"**.

### 🔹 Swagger (Documentação da API)
📍 [http://localhost:4444/swagger](http://localhost:4444/swagger)  
Aqui você pode testar os endpoints da API.

### 🔹 Banco de Dados (MySQL)

Caso queira acessar o banco pelo **DBeaver** ou outro cliente MySQL, use as  credenciais do .env


### 🔹 Automação n8n
📍 [http://localhost:5678](http://localhost:5678)  
Aqui você pode configurar e visualizar os workflows de automação.

---

## 📌 6️⃣ Estrutura do Projeto

A aplicação é dividida em **quatro segmentos principais**:

📂 **backend/** - Servidor Node.js com Express e Sequelize.  
📂 **frontend/** - Interface web construída com HTML, CSS e JavaScript puro.  
🎲 **mysql** - Banco de dados MySQL para armazenar os registros de ponto.  
🖥️ **n8n** - Automação de processos, como a geração automática de relatórios de horas.

---

## 📌 7️⃣ Comandos Úteis

Aqui estão alguns comandos úteis para gerenciar os containers:

### 🔹 Verificar Containers Rodando
```sh
docker ps
```

### 🔹 Reiniciar o Backend
```sh
docker-compose restart backend
```

### 🔹 Remover Todos os Containers
```sh
docker-compose down
```

### 🔹 Recriar e Atualizar a Aplicação
```sh
docker-compose down
docker-compose up -d --build
```

---

## 📌 8️⃣ Problemas Comuns e Soluções

### ❌ O backend não inicia ou não responde

✅ **Solução:**

1. Verifique os logs:
   ```sh
   docker-compose logs -f backend
   ```
2. Certifique-se de que o `.env` está corretamente configurado.  
3. Reinicie o backend:
   ```sh
   docker-compose restart backend
   ```



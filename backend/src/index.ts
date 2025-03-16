import express from "express";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import swaggerDocument from "./swagger.json"; // Importa a documentação Swagger
import healthRoutes from "./routes/health"; // Importa a rota de teste

dotenv.config(); // Carrega variáveis do .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para JSON
app.use(express.json());

// Middleware para a documentação do Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Rota de teste para garantir que a API está rodando
app.use("/", healthRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📑 Swagger disponível em http://localhost:${PORT}/api-docs`);
});

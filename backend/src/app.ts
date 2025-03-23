import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { sequelize } from './config/database';
import routes from './routes';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerConfig } from './config/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4444;

app.use(cors());
app.use(express.json());
app.use(routes);

// Swagger
const swaggerSpec = swaggerJSDoc(swaggerConfig);
app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get('/swagger.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// DB + servidor
sequelize.sync({ alter: true }).then(() => {
  console.log('📦 Tabelas sincronizadas com sucesso!');
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📑 Swagger em: http://localhost:${PORT}/swagger`);
  });
});

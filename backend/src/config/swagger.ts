import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerConfig: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PeopleSync API',
      version: '1.0.0',
      description: 'Documentação da API do PeopleSync',
    },
    servers: [
      {
        url: 'http://localhost:4444',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // apenas uma dica para o Swagger UI
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/controllers/**/*.ts', './src/routes/**/*.ts'],
};

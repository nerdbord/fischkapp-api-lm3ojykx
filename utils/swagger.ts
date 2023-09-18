import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fischkapp API',
      version: '1.0.0',
      description: 'API for Fischkapp flashcards',
    },
  },
  apis: ['./routes/*.ts', './models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
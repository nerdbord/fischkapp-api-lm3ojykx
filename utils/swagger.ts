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
  // Paths to API docs and routes
  apis: ['**/*.ts'], 
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
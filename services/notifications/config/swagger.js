const swaggerJSDoc = require('swagger-jsdoc');
const path = require('path');

const yamlPath = path.resolve(__dirname, '../docs/notification.yaml');

const options = {
  definition: {
    openapi: '3.0.0',
  },
  apis: [yamlPath],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
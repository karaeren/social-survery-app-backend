const { version } = require('../../package.json');
const config = require('../config/config');

const swagger = {
  openapi: '3.0.0',
  info: {
    title: 'Social Survey App API documentation',
    version,
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
    },
  ],
};

module.exports = swagger;

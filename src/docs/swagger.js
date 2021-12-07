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
      url: `${config.env === 'production' ? config.websiteUrl : 'http://localhost:' + config.port}/api/v1`
    },
  ],
};

module.exports = swagger;

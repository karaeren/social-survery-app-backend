const Joi = require('joi');

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    color: Joi.string(),
  }),
};

module.exports = {
  createCategory,
};

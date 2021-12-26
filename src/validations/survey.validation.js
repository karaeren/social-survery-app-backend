const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getSurveys = {
  query: Joi.object().keys({
    name: Joi.string(),
    searchForName: Joi.bool().default(false),
    categoryId: Joi.custom(objectId),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const createSurvey = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    categoryId: Joi.custom(objectId).required(),
  }),
};

const createCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    color: Joi.string(),
    rank: Joi.number(),
  }),
};

const updateCategory = {
  params: Joi.object().keys({
    categoryId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      color: Joi.string(),
      rank: Joi.number(),
    })
    .min(1),
};

const deleteCategory = {
  params: Joi.object().keys({
    categoryId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getSurveys,
  createSurvey,
  createCategory,
  updateCategory,
  deleteCategory,
};

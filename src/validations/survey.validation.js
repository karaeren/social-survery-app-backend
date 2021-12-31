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
    description: Joi.string().required(),
    categoryId: Joi.custom(objectId).required(),
    questions: Joi.array()
      .items({
        question_id: Joi.number().integer().required(),
        question_text: Joi.string().required(),
        answers: Joi.array()
          .items({
            answer_id: Joi.number().integer().required(),
            answer_text: Joi.string().required(),
          })
          .required(),
      })
      .required(),
  }),
};

const submitAnswers = {
  body: Joi.object().keys({
    surveyId: Joi.custom(objectId).required(),
    answers: Joi.array()
      .items({
        question_id: Joi.number().integer().required(),
        answer_id: Joi.number().integer().required(),
      })
      .required()
      .min(1),
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
  submitAnswers,
  createCategory,
  updateCategory,
  deleteCategory,
};

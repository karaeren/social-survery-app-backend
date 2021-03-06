const Joi = require('joi').extend(require('@joi/date'));
const { objectId } = require('./custom.validation');

const getSurveys = {
  query: Joi.object().keys({
    name: Joi.string(),
    searchForName: Joi.bool().default(false),
    categoryId: Joi.custom(objectId),
    includeGeoSpecificSurveys: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSurveysByLocation = {
  query: Joi.object().keys({
    lat: Joi.number().required(),
    long: Joi.number().required(),
  }),
};

const getSurveysById = {
  body: Joi.object().keys({
    id: Joi.array()
      .unique()
      .min(1)
      .max(25)
      .items(Joi.custom(objectId))
      .required(),
  }),
};

const createSurvey = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string().required(),
    categoryId: Joi.custom(objectId).required(),
    expireDate: Joi.date().format('YYYY-MM-DD').utc().allow(null),
    questions: Joi.array()
      .items({
        questionId: Joi.number().integer().required(),
        questionText: Joi.string().required(),
        questionType: Joi.string(),
        answers: Joi.array()
          .items({
            answerId: Joi.number().integer().required(),
            answerText: Joi.string().required(),
            sliderMin: Joi.number(),
            sliderMax: Joi.number(),
          })
          .required(),
      })
      .required(),
    geoFeatures: Joi.array().items({
      name: Joi.string(),
      type: Joi.string().required(),
      coordinates: Joi.array().required(),
    }),
  }),
};

const updateSurvey = {
  params: Joi.object().keys({
    surveyId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string(),
      categoryId: Joi.custom(objectId),
      expireDate: Joi.date().format('YYYY-MM-DD').utc().allow(null),
      geoFeatures: Joi.array().items({
        name: Joi.string(),
        type: Joi.string().required(),
        coordinates: Joi.array().required(),
      }),
    })
    .min(1),
};

const deleteSurvey = {
  params: Joi.object().keys({
    surveyId: Joi.string().custom(objectId),
  }),
};

const submitAnswers = {
  body: Joi.object().keys({
    surveyId: Joi.custom(objectId).required(),
    location: Joi.object()
      .keys({
        lat: Joi.number().required(),
        long: Joi.number().required(),
      })
      .required(),
    answers: Joi.array()
      .items({
        questionId: Joi.number().integer().required(),
        multipleChoiceValue: Joi.number().integer(),
        sliderValue: Joi.number(),
        rankingValue: Joi.array().items(Joi.number()),
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

const getResults = {
  params: Joi.object().keys({
    surveyId: Joi.required().custom(objectId),
  }),
};

module.exports = {
  getSurveys,
  getSurveysByLocation,
  getSurveysById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  submitAnswers,
  createCategory,
  updateCategory,
  deleteCategory,
  getResults,
};

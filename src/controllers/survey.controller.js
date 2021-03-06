const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { surveyService } = require('../services');
const ApiError = require('../utils/ApiError');

const getSurveys = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'categoryId']);
  const options = pick(req.query, ['searchForName', 'sortBy', 'limit', 'page']);

  if (
    typeof req.query.includeGeoSpecificSurveys === 'undefined' ||
    req.query.includeGeoSpecificSurveys === false
  ) {
    filter['geoFeatures.0'] = { $exists: false };
  }

  const result = await surveyService.querySurveys(filter, options);
  res.send(result);
});

const getSurveysByLocation = catchAsync(async (req, res) => {
  const result = await surveyService.getSurveysByLocation(
    req.query.lat,
    req.query.long
  );
  res.send(result);
});

const getSurveysById = catchAsync(async (req, res) => {
  const { id } = req.body;
  const results = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const _id of id) {
    const survey = await surveyService.getSurveyById(_id);
    if (survey) results.push(survey);
  }
  res.send(results);
});

const createSurvey = catchAsync(async (req, res) => {
  const survey = await surveyService.createSurvey(req.body);

  res.status(httpStatus.CREATED).send({ survey });
});

const updateSurvey = catchAsync(async (req, res) => {
  const survey = await surveyService.updateSurveyById(
    req.params.surveyId,
    req.body
  );
  res.send(survey);
});

const deleteSurvey = catchAsync(async (req, res) => {
  await surveyService.deleteSurveyById(req.params.surveyId);
  res.status(httpStatus.NO_CONTENT).send();
});

const submitAnswers = catchAsync(async (req, res) => {
  await surveyService.submitAnswers(req.user, req.body);
  res.status(httpStatus.NO_CONTENT).send();
});

const getCategories = catchAsync(async (req, res) => {
  const result = await surveyService.getCategories();
  res.send(result);
});

const createCategory = catchAsync(async (req, res) => {
  const category = await surveyService.createCategory(req.body);

  res.status(httpStatus.CREATED).send({ category });
});

const updateCategory = catchAsync(async (req, res) => {
  const category = await surveyService.updateCategoryById(
    req.params.categoryId,
    req.body
  );
  res.send(category);
});

const deleteCategory = catchAsync(async (req, res) => {
  await surveyService.deleteCategoryById(req.params.categoryId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getResults = catchAsync(async (req, res) => {
  const survey = await surveyService.getSurveyById(req.params.surveyId, true);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey not found');
  }

  const submissions = await surveyService.getSubmissionsForSurvey(survey._id);

  res.send({
    results: {
      survey,
      submissions,
    },
  });
});

module.exports = {
  getSurveys,
  getSurveysByLocation,
  getSurveysById,
  createSurvey,
  updateSurvey,
  deleteSurvey,
  submitAnswers,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getResults,
};

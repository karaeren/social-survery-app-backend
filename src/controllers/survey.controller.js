const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const pick = require('../utils/pick');
const { surveyService } = require('../services');

const getSurveys = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'categoryId']);
  const options = pick(req.query, ['searchForName', 'sortBy', 'limit', 'page']);
  const result = await surveyService.querySurveys(filter, options);
  res.send(result);
});

const createSurvey = catchAsync(async (req, res) => {
  const survey = await surveyService.createSurvey(req.body);

  res.status(httpStatus.CREATED).send({ survey });
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

module.exports = {
  getSurveys,
  createSurvey,
  submitAnswers,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

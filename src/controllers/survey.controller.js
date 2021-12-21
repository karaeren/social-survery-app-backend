const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { surveyService } = require('../services');

const getCategories = catchAsync(async (req, res) => {
  const result = await surveyService.getCategories();
  res.send(result);
});

const createCategory = catchAsync(async (req, res) => {
  const category = await surveyService.createCategory(req.body);

  res.status(httpStatus.CREATED).send({ category });
});

module.exports = { getCategories, createCategory };

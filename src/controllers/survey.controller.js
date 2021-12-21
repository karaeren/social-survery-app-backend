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
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

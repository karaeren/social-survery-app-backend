const httpStatus = require('http-status');
const { Survey, Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Query for surveys
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.searchForName] - Search for "name" instead of looking for an exact match
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySurveys = async (filter, options) => {
  const surveys = await Survey.paginate(filter, options);
  return surveys;
};

/**
 * Create a survey
 * @param {Object} surveyBody
 * @returns {Promise<Survey>}
 */
const createSurvey = async (surveyBody) => {
  const findCategory = await Category.findOne({ _id: surveyBody.categoryId });
  if (!findCategory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category is not valid');
  }

  return Survey.create(surveyBody);
};

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<Category>}
 */
const getCategoryById = async (id) => {
  return Category.findById(id);
};

/**
 * Get categories
 * @returns {Promise<Category>}
 */
const getCategories = async () => {
  const users = await Category.find();
  return users;
};

/**
 * Create a category
 * @param {Object} categoryBody
 * @returns {Promise<Category>}
 */
const createCategory = async (categoryBody) => {
  if (categoryBody.rank && (await Category.isRankTaken(categoryBody.rank))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Rank already taken');
  }
  return Category.create(categoryBody);
};

/**
 * Update category by id
 * @param {ObjectId} categoryId
 * @param {Object} updateBody
 * @returns {Promise<Category>}
 */
const updateCategoryById = async (categoryId, updateBody) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  if (
    updateBody.rank &&
    (await Category.isRankTaken(updateBody.rank, categoryId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Rank already taken');
  }
  Object.assign(category, updateBody);
  await category.save();
  return category;
};

/**
 * Delete category by id
 * @param {ObjectId} categoryId
 * @returns {Promise<Category>}
 */
const deleteCategoryById = async (categoryId) => {
  const category = await getCategoryById(categoryId);
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  await category.remove();
  return category;
};

module.exports = {
  querySurveys,
  createSurvey,
  getCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};

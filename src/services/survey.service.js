const httpStatus = require('http-status');
const { Category } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get category by id
 * @param {ObjectId} id
 * @returns {Promise<User>}
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
  if (
    categoryBody.rank &&
    (await Category.isRankTaken(categoryBody.rank, -1))
  ) {
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
  getCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};

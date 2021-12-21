const { Category } = require('../models');

/**
 * Get categories
 * @returns {Promise<Category>}
 */
const getCategories = async () => {
  const users = await Category.find();
  return users;
};

const createCategory = async (categoryBody) => {
  return Category.create(categoryBody);
};

module.exports = {
  getCategories,
  createCategory,
};

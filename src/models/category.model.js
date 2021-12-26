const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
    default: '#FFFFFF',
  },
  rank: {
    type: Number,
    default: 0, // 0 means unimportant, positive numbers means rank of importance
  },
});

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);

/**
 * Check if rank is taken
 * @param {number} rank - Rank
 * @param {ObjectId} [excludeCategoryId] - The id of the category to be excluded
 * @returns {Promise<boolean>}
 */
categorySchema.statics.isRankTaken = async function (rank, excludeCategoryId) {
  if (rank === 0) return false;
  const category = await this.findOne({
    rank,
    ...(excludeCategoryId && { _id: { $ne: excludeCategoryId } }),
  });
  return !!category;
};

/**
 * @typedef Category
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

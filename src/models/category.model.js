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
});

// add plugin that converts mongoose to json
categorySchema.plugin(toJSON);

/**
 * @typedef User
 */
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

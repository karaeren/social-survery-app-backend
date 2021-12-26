const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const surveySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  questions: {
    type: Array,
    default: [],
  },
});

// add plugin that converts mongoose to json
surveySchema.plugin(toJSON);
surveySchema.plugin(paginate);

/**
 * @typedef Survey
 */
const Survey = mongoose.model('Survey', surveySchema);

module.exports = Survey;

const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const questionTypes = ['multiple-choice', 'slider', 'ranking'];

const answerSchema = new mongoose.Schema({
  answerId: {
    type: Number,
    required: true,
  },
  answerText: {
    type: String,
    required: true,
  },
  sliderMin: {
    type: Number,
  },
  sliderMax: {
    type: Number,
  },
});

const questionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
  },
  questionText: {
    type: String,
    required: true,
  },
  questionType: {
    type: String,
    enum: questionTypes,
    default: 'multiple-choice',
  },
  answers: {
    type: [answerSchema],
    required: true,
  },
});

const surveySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  expireDate: {
    type: Date,
    default: null,
  },
  submissionCount: {
    type: Number,
    default: 0,
  },
  questions: {
    type: [questionSchema],
    default: [],
  },
  geoFeatures: {
    type: [Object],
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

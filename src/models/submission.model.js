const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const submissionSchema = mongoose.Schema({
  shadowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shadow',
    required: true,
  },
  location: {
    lat: {
      type: Number,
      required: true,
    },
    long: {
      type: Number,
      required: true,
    },
  },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Survey',
    required: true,
  },
  answers: {
    type: Array,
    default: [],
  },
});

// add plugin that converts mongoose to json
submissionSchema.plugin(toJSON);

/**
 * @typedef Submission
 */
const Submission = mongoose.model('Submission', submissionSchema);

module.exports = Submission;

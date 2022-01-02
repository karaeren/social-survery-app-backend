const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const genderOptions = ['male', 'female', 'other'];

const shadowSchema = mongoose.Schema(
  {
    birthdate: {
      type: Date,
    },
    gender: {
      type: String,
      enum: genderOptions,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
shadowSchema.plugin(toJSON);

/**
 * @typedef Shadow
 */
const Shadow = mongoose.model('Shadow', shadowSchema);

module.exports = Shadow;

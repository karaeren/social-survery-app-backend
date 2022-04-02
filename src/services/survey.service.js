const httpStatus = require('http-status');
const { booleanPointInPolygon } = require('@turf/turf');
const { Survey, Category, Submission, Shadow } = require('../models');
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
 * Get survey by location
 * @param {number} lat
 * @param {number} long
 * @returns {Promise<Survey>}
 */
const getSurveysByLocation = async (lat, long) => {
  const location = [long, lat];
  const surveys = await Survey.find({
    geoFeatures: { $exists: true, $not: { $size: 0 } },
  });

  const filteredSurveys = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const s of surveys) {
    if (s.geoFeatures && s.geoFeatures.length > 0) {
      // eslint-disable-next-line no-restricted-syntax
      for (const feature of s.geoFeatures) {
        const validLocation = booleanPointInPolygon(location, feature);
        if (validLocation) {
          const copy = JSON.parse(JSON.stringify(s));
          delete copy.geoFeatures;
          filteredSurveys.push(copy);
          break;
        }
      }
    }
  }

  if (filteredSurveys.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }

  return { results: filteredSurveys };
};

/**
 * Get survey by id
 * @param {ObjectId} id
 * @returns {Promise<Survey>}
 */
const getSurveyById = async (id, populate = false) => {
  if (populate) return Survey.findById(id).populate('categoryId');

  return Survey.findById(id);
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
 * Update survey by id
 * @param {ObjectId} surveyId
 * @param {Object} updateBody
 * @returns {Promise<Survey>}
 */
const updateSurveyById = async (surveyId, updateBody) => {
  const survey = await getSurveyById(surveyId);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey not found');
  }
  if (
    updateBody.categoryId &&
    !(await Category.findOne({ _id: updateBody.categoryId }))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Category is not valid');
  }
  Object.assign(survey, updateBody);
  await survey.save();
  return survey;
};

/**
 * Delete survey by id
 * @param {ObjectId} surveyId
 * @returns {Promise<Survey>}
 */
const deleteSurveyById = async (surveyId) => {
  const survey = await getSurveyById(surveyId);
  if (!survey) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Survey not found');
  }
  await survey.remove();
  return survey;
};

/**
 * Compare users answers to survey's question and answer list and validate
 * @param {Array} questions
 * @param {Array} userAnswers
 * @returns {true}
 */
const validateAnswers = (questions, userAnswers) => {
  const questionMap = {};

  questions.map((question) => {
    questionMap[question.question_id] = question.answers.map(
      (x) => x.answer_id
    );

    return {};
  });

  userAnswers.map((userAnswer) => {
    if (
      questionMap[userAnswer.question_id] &&
      questionMap[userAnswer.question_id].includes(userAnswer.answer_id)
    ) {
      delete questionMap[userAnswer.question_id];
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Answers are not valid');
    }

    return {};
  });

  if (Object.keys(questionMap).length > 0) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Not all questions are answered'
    );
  }
};

/**
 * Submit answers to survey
 * @param {Object} user
 * @param {Object} submissionBody
 * @returns {Promise}
 */
const submitAnswers = async (user, submissionBody) => {
  if (user.submittedSurveys.includes(submissionBody.surveyId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You already submitted this survey'
    );
  }

  const findSurvey = await Survey.findOne({ _id: submissionBody.surveyId });
  if (!findSurvey) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Survey is not valid');
  }

  if (findSurvey.expireDate && new Date() - findSurvey.expireDate > 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Survey has expired');
  }

  if (findSurvey.geoFeatures && findSurvey.geoFeatures.length > 0) {
    let usersLocationIsValid = false;

    // eslint-disable-next-line no-restricted-syntax
    for (const geoFeature of findSurvey.geoFeatures) {
      if (
        booleanPointInPolygon(
          [submissionBody.location.long, submissionBody.location.lat],
          geoFeature
        )
      ) {
        usersLocationIsValid = true;
        break;
      }
    }

    if (!usersLocationIsValid) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Your location is not valid for this survey'
      );
    }
  }

  validateAnswers(findSurvey.questions, submissionBody.answers);

  const shadow = await Shadow.create({
    birthdate: user.birthdate,
    gender: user.gender,
  });

  await Submission.create({
    shadowId: shadow._id,
    ...submissionBody,
  });

  user.submittedSurveys.push(submissionBody.surveyId);
  await user.save();

  await Survey.findOneAndUpdate(
    { _id: submissionBody.surveyId },
    { $inc: { submissionCount: 1 } }
  ).exec();
};

/**
 * Get all of the submissions for a survey
 * @param {ObjectId} surveyId
 * @returns {Promise<Submission>}
 */
const getSubmissionsForSurvey = async (surveyId) => {
  return Submission.find({ surveyId })
    .select('_id answers shadowId location')
    .populate('shadowId');
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
  getSurveysByLocation,
  getSurveyById,
  createSurvey,
  updateSurveyById,
  deleteSurveyById,
  submitAnswers,
  getSubmissionsForSurvey,
  getCategories,
  createCategory,
  updateCategoryById,
  deleteCategoryById,
};

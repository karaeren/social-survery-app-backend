const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const surveyValidation = require('../../validations/survey.validation');
const surveyController = require('../../controllers/survey.controller');

const router = express.Router();

// "/survey"
router
  .route('/')
  .get(
    auth(),
    validate(surveyValidation.getSurveys),
    surveyController.getSurveys
  )
  .post(
    auth('manageSurveys'),
    validate(surveyValidation.createSurvey),
    surveyController.createSurvey
  );

// "/survey/categories"
router
  .route('/categories')
  .get(auth(), surveyController.getCategories)
  .post(
    auth('manageCategories'),
    validate(surveyValidation.createCategory),
    surveyController.createCategory
  );

router
  .route('/categories/:categoryId')
  .patch(
    auth('manageCategories'),
    validate(surveyValidation.updateCategory),
    surveyController.updateCategory
  )
  .delete(
    auth('manageCategories'),
    validate(surveyValidation.deleteCategory),
    surveyController.deleteCategory
  );

module.exports = router;
const express = require('express');
const basicAuth = require('express-basic-auth');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const surveyRoute = require('./survey.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/survey',
    route: surveyRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Swagger docs
if (config.env === 'development' || config.prodSwagger) {
  router.use(
    '/docs',
    basicAuth({
      users: { admin: 'isütez' },
      challenge: true,
    }),
    docsRoute
  );
}

module.exports = router;

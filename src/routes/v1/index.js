const express = require('express');
const basicAuth = require('express-basic-auth');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
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
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

// Swagger docs
if (config.env === 'development') {
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

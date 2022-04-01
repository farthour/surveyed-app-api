const express = require("express");
const httpStatus = require("http-status");
const globalMessages = require("../config/messages").global;
const { errorConverter } = require("../middlewares/error");
const { ApiError } = require("../utils");

const authRoutes = require("./auth");
const surveyRoutes = require("./surveys");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },

  {
    path: "/surveys",
    route: surveyRoutes,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

const handleUndefinedRoutes = (req, res, next) =>
  errorConverter(
    new ApiError(httpStatus.NOT_FOUND, globalMessages.error.notFound),
    req,
    res,
    next
  );

router.use("*", handleUndefinedRoutes);

module.exports = router;

const httpStatus = require("http-status");
const { errorMiddleware } = require("./middlewares");
const { ApiError } = require("../utils");

const routes = require("../routes");
const logger = require("../config/logger");

module.exports = function (app) {
  // v1 api routes
  app.use("/api/v1", routes);

  // send back a 404 error for any unknown api request
  app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
  });

  // convert error to ApiError if needed
  app.use(errorMiddleware.errorConverter);

  // handle error
  app.use(errorMiddleware.errorHandler);
};

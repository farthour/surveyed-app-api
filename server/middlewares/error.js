const logger = require("../config/logger");
const httpStatus = require("http-status");
const { ApiError } = require("../utils");

/**
 * Conver default error to ApiError and sends to client
 *
 * @param {Error} err {statusCode: number, message: string}
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const errorConverter = (err, req, res, next) => {
  logger.info('errorConverter')
  let error = err;
  if (err) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = String(error.message || httpStatus[statusCode]);
    error = new ApiError(statusCode, message, false, err.stack);
    res.status(statusCode).send({ err: message });

    if (process.env.NODE_ENV === "development") {
      logger.error({ message: error.message, metadata: err });
    }
  }
  next(error);
};

/**
 * Handle error and sends response back to client
 *
 * @param {ApiError} err
 * @param {Request} req
 * @param {Response} res
 */
const errorHandler = (err, req, res) => {
  logger.info('errorHandler')
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = String(httpStatus[httpStatus.INTERNAL_SERVER_ERROR]);
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    logger.error({ message: err.message, metadata: err });
  }

  res.status(statusCode).send(response);
};

module.exports = { errorHandler, errorConverter };

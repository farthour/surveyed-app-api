const winston = require("winston");
const httpStatus = require("http-status");
const { ApiError } = require("../utils");

/**
 * Handle error and sends response back to client
 *
 * @param {Error} err {statusCode: number, message: string}
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (err) {
    const statusCode =
      error.statusCode || error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR;

    const message = String(error.mesage || httpStatus[statusCode]);
    error = new ApiError(statusCode, message, false, err.stack);
    res.status(statusCode).send({ err: message });
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
    winston.error({ message: err.message, metadata: err });
  }

  res.status(statusCode).send(response);
};

module.exports = { errorHandler, errorConverter };

/**
//  * Handle server error and sends response back to client
//  *
//  * @param {object} res  express response object
//  * @param {number} statusCode status code to send alng with response
//  * @param {any} err client message to be send along with response
//  */
// function sendServerError(res, statusCode, err) {
//   if (statusCode < 500) statusCode = 500;

//   let errMessage = null;

//   if (err.isBoom) {
//     winston.error({ message: err.output.payload.message, metadata: err });
//     errMessage = err.output.payload;
//   } else {
//     winston.error({ message: err.message, metadata: err });
//     errMessage = "Something went wrong";
//   }
//   res.status(statusCode).send(errMessage);
// }

// module.exports = function (err, req, res, next) {
//   if (err.isBoom) {
//     let { isServer, output } = err;
//     let { statusCode, payload } = output;
//     if (isServer) return sendServerError(res, statusCode, err);
//     // Log error to mongodb
//     winston.error({ message: payload.message, metadata: err });
//     res.status(statusCode).send(payload);
//   } else {
//     sendServerError(res, 500, err);
//   }
// };

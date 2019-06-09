const winston = require("winston");

/**
 * Handle server error and sends response back to client
 *
 * @param {object} res  express response object
 * @param {number} statusCode status code to send alng with response
 * @param {any} err client message to be send along with response
 */
function sendServerError(res, statusCode, err) {
  if (statusCode < 500) statusCode = 500;

  let errMessage = null;

  if (err.isBoom) {
    winston.error({ message: err.output.payload.message, metadata: err });
    errMessage = err.output.payload;
  } else {
    winston.error({ message: err.message, metadata: err });
    errMessage = "Something went wrong";
  }
  res.status(statusCode).send(errMessage);
}

module.exports = function(err, req, res, next) {
  if (err.isBoom) {
    let { isServer, output } = err;
    let { statusCode, payload } = output;
    if (isServer) return sendServerError(res, statusCode, err);
    // Log error to mongodb
    winston.error({ message: payload.message, metadata: err });
    res.status(statusCode).send(payload);
  } else {
    sendServerError(res, 500, err);
  }
};

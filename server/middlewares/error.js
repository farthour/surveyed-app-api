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
    winston.error(err.output, err);
    errMessage = err.output.payload;
  } else {
    winston.error(err.message, err);
    errMessage = err.message;
  }
  res.status(statusCode).send(errMessage);
  process.exit(1);
}

module.exports = function(err, req, res, next) {
  if (err.isBoom) {
    let { isServer, output } = err;
    let { statusCode, payload } = output;
    if (isServer) return sendServerError(res, statusCode, err);
    res.status(statusCode).send(payload);
  } else {
    sendServerError(res, 500, new Error("Something went wrong."));
  }
};

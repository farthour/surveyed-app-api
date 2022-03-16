const errorMiddleware = require("./error");
const networkMiddleware = require("./network");
const validateMiddleware = require("./validate");

module.exports = { errorMiddleware, networkMiddleware, validateMiddleware };

const errorMiddleware = require("./error");
const networkMiddleware = require("./network");
const validateMiddleware = require("./validate");
const authMiddleware = require("./auth");

module.exports = { errorMiddleware, networkMiddleware, validateMiddleware, authMiddleware };

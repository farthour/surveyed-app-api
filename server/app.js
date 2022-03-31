require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const logger = require("./config/logger");
const app = express();

logger.info(`starting env: ${process.env.NODE_ENV}`);

// Middlewares
app.use(morgan("dev"));
require("./startup/db")();
require("./startup/middlewares").networkMiddleware(app);
require("./startup/routes")(app);

// Port config
const port = process.env.PORT || 7000;

// Listen to the port
let server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

const exitHandler = () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

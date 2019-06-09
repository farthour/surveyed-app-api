const winston = require("winston");
require("winston-mongodb");

module.exports = function() {
  // Handle Uncaught Exceptions
  // Stores them in a log file named: uncaughtExceptions.log
  // at the root of the project
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  // Handles Unhandled Rejections
  // it throws an exception, which is not caught
  // so the exception goes to `winston uncaught exceptions`
  process.on("unhandledRejection", ex => {
    throw ex;
  });

  // Create a `logfile.log` to log all the logs at 'info' level
  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  // Add a 'log' collection to MongoDB database
  winston.add(
    new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      level: "error",
      metaKey: "meta" // DO NOT CHANGE THIS PROPERTY
    })
  );
};

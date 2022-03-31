const winston = require("winston");
require("winston-mongodb");

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level:
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "staging"
      ? "debug"
      : "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    enumerateErrorFormat(),
    // process.env.NODE_ENV === "development"
    //   ? winston.format.colorize()
    //   : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
  ),
  transports: [
		new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
		new winston.transports.MongoDB({
      db: process.env.MONGODB_URI,
      level: "error"
    }),
    new winston.transports.Console({
      stderrLevels: ["error"],
    }),
  ],
});

module.exports = logger;

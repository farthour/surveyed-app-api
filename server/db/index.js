const winston = require("winston");
const mongoose = require("mongoose");

module.exports = async () => {
  mongoose.Promise = global.Promise;

  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true });
  winston.info("Connected to MongoDB...");
};

const logger = require("../config/logger");
const mongoose = require("mongoose");

module.exports = async () => {
  mongoose.Promise = global.Promise;

  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  logger.info("Connected to MongoDB...");
};

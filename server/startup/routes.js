/**
 * Create base endpoints in this module
 * Import the routes that are exported from /server/routes/index.js
 */

const { userRoutes } = require("../routes");
const { errorMiddleware } = require("./middlewares");

module.exports = function(app) {
  // All the routes below this line
  app.use("/api/users", userRoutes);

  // All the routes above this line
  app.use(errorMiddleware);
};

/**
 * Controller
 *
 * Specifically to get all users
 * Can require actions
 */

const boom = require("@hapi/boom");

module.exports = async (req, res, next) => {
  // Handle
  console.log("handling");
  // throw new Error("New Error");
  throw boom.badGateway("invalid id", { a: 1 });
  // res.status(200).send([{ username: "Rahul" }, { username: "Pankaj" }]);
};

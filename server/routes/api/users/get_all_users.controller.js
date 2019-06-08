/**
 * Controller
 *
 * Specifically to get all users
 * Can require actions
 */

const boom = require("@hapi/boom");

module.exports = async (req, res, next) => {
  // Handle
  // To throw errors, learn about 'boom' package,
  // https://github.com/hapijs/boom/blob/HEAD/API.md
  // next line is an example of error throwing with 'boom'
  // throw boom.notFound("Not found");
  res.status(200).send([{ username: "Ross" }, { username: "Rachel" }]);
};

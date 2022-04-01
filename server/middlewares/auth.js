const httpStatus = require("http-status");
const passport = require("passport");
const cookie = require("cookie");

const { roleRights } = require("../config/roles");
const ApiError = require("../utils/ApiError");
const authMessages = require("../config/messages").auth;

const verifyCallback =
  (req, resolve, reject, requiredRights = [], predicate) =>
  async (err, user) => {
    // if there is no refresh token and
    // req is given a stolen accessToken
    // then it will successfully execute
    // So, we are also checking cookie
    // for refreshTokens
    const cookies = req.headers.cookie && cookie.parse(req.headers.cookie);

    if (err || !user || !cookies.refreshToken) {
      return reject(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          authMessages.error.pleaseAuthenticate
        )
      );
    }

    req.user = user;

    // Consider short circuiting this logic for any admin type once FE has
    // the ability to modify data
    if (requiredRights.length) {
      const userRights = roleRights.get(user.type) || [];
      const hasRequiredRights = requiredRights.every((requiredRight) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params.userId !== user.id) {
        return reject(
          new ApiError(httpStatus.FORBIDDEN, authMessages.error.forbidden)
        );
      }
    }

    if (predicate) {
      const predicateResult = await predicate(user, req);
      if (!predicateResult) {
        return reject(
          new ApiError(httpStatus.FORBIDDEN, authMessages.error.forbidden)
        );
      }
    }

    resolve();
  };

const auth =
  (requiredRights = [], predicate = () => Promise.resolve(true)) =>
  async (req, res, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        "jwt",
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights, predicate)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;

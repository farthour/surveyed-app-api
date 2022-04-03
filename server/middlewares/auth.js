const httpStatus = require("http-status");
const passport = require("passport");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");

const { roleRights } = require("../config/roles");
const ApiError = require("../utils/ApiError");
const {
  auth: authMessages,
  global: globalMessages,
} = require("../config/messages");
const { verifyToken } = require("../services/tokens");
const TOKEN_TYPE = require("../config/token");

const verifyCallback =
  (req, resolve, reject, requiredRights = [], predicate) =>
  async (err, user) => {
    if (err || !user) {
      return reject(
        new ApiError(
          httpStatus.UNAUTHORIZED,
          authMessages.error.pleaseAuthenticate
        )
      );
    }

    // if there is no refresh token and
    // req is given a stolen accessToken
    // then it will successfully execute
    // So, we are also checking cookie
    // for refreshTokens
    const cookies = req.headers.cookie && cookie.parse(req.headers.cookie);

    // Check if refreshToken and accessToken are of same user
    // accessToken is already decoded into 'user'
    // So, we will check both ids are same
    try {
      const refreshTokenData = await verifyToken(
        cookies?.refreshToken,
        TOKEN_TYPE.REFRESH
      );
      if (refreshTokenData.user.id !== user.id)
        throw Error(authMessages.error.pleaseAuthenticate);
    } catch (err) {
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
          new ApiError(httpStatus.FORBIDDEN, globalMessages.error.forbidden)
        );
      }
    }

    if (predicate) {
      const predicateResult = await predicate(user, req);
      if (!predicateResult) {
        return reject(
          new ApiError(httpStatus.FORBIDDEN, globalMessages.error.forbidden)
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

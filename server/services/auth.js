const httpStatus = require("http-status");

const authMessages = require("../config/messages").auth;

const Token = require("../models/token");
const TOKEN_TYPE = require("../config/token");
const tokenService = require("../services/tokens");
const userService = require("../services/user");
const ApiError = require("../utils/ApiError");

// Login with email and password
const login = async (email, password) => {
  const user = await userService.getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      authMessages.error.invalidEmailPassword
    );
  }
  return user;
};

// Logout
const logout = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: TOKEN_TYPE.REFRESH,
    blacklisted: false,
  });
  if (!refreshTokenDoc) {
    throw new ApiError(httpStatus.NOT_FOUND, authMessages.error.notFound);
  }
  await refreshTokenDoc.remove();
};

// Refresh auth tokens
const refreshAuth = async (refreshToken) => {
  try {
    const refreshTokenDoc = await tokenService.verifyToken(
      refreshToken,
      TOKEN_TYPE.REFRESH
    );
    const user = await userService.getUserById(refreshTokenDoc.user.id);
    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        authMessages.error.userNotFound
      );
    }
    await refreshTokenDoc.remove();
    const tokens = await tokenService.generateAuthTokens(user);
    return { user, tokens };
  } catch (error) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      authMessages.error.pleaseAuthenticate
    );
  }
};

// Reset password
const resetPassword = async (resetPasswordToken, resetPassword) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      TOKEN_TYPE.RESET_PASSWORD
    );
    const user = await userService.getUserById(resetPasswordTokenDoc.user.id);
    if (!user) {
      throw new Error(authMessages.error.userNotFound);
    }
    await userService.updateUserById(user.id, { resetPassword });
    await Token.deleteMany({ user: user.id, type: TOKEN_TYPE.RESET_PASSWORD });
    return user;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      authMessages.error.passwordResetFailed
    );
  }
};

// Verify email
const verifyEmail = async (verifyEmailToken) => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      TOKEN_TYPE.VERIFY_EMAIL
    );
    const user = await userService.getUserById(verifyEmailTokenDoc.user.id);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: TOKEN_TYPE.VERIFY_EMAIL });
    return await userService.updateUserById(user.id, { isEmailVerified: true });
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      authMessages.error.emailVerificationFailed
    );
  }
};

module.exports = {
  login,
  logout,
  refreshAuth,
  resetPassword,
  verifyEmail,
};

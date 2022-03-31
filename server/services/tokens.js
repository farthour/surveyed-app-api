const httpStatus = require("http-status");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const authMessages = require("../config/messages").auth;
const Token = require("../models/token");
const TOKEN_TYPE = require("../config/token");
const userService = require("../services/user");
const ApiError = require("../utils/ApiError");

// Generate token
const generateToken = (
  userId,
  expires,
  type,
  secret = process.env.JWT_SECRET
) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

// Save a token
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};

// Verify token and return token doc (or throw an error if it is not valid)
const verifyToken = async (token, type) => {
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  })
    .populate("user")
    .exec();
  if (!tokenDoc) {
    throw new Error(authMessages.error.tokenNotFound);
  }

  return tokenDoc;
};

// Verify phone two factor auth codes
const verify2FA = async (token, type) => {
  const tokenDoc = await Token.findOne({
    token,
    type,
    blacklisted: false,
  })
    .populate("user")
    .exec();
  if (!tokenDoc) {
    throw new Error(authMessages.error.tokenNotFound);
  }

  return tokenDoc;
};

// Generate auth tokens
const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(
    process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    "minutes"
  );
  const accessToken = generateToken(
    user.id,
    accessTokenExpires,
    TOKEN_TYPE.ACCESS
  );

  const refreshTokenExpires = moment().add(
    process.env.JWT_REFRESH_EXPIRATION_DAYS,
    "days"
  );
  const refreshToken = generateToken(
    user.id,
    refreshTokenExpires,
    TOKEN_TYPE.REFRESH
  );
  await saveToken(
    refreshToken,
    user.id,
    refreshTokenExpires,
    TOKEN_TYPE.REFRESH
  );

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

// Generate reset password token
const generateResetPasswordToken = async (email) => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      authMessages.error.userWithEmailNotFound
    );
  }
  const expires = moment().add(
    process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    "minutes"
  );
  const resetPasswordToken = generateToken(
    user.id,
    expires,
    TOKEN_TYPE.RESET_PASSWORD
  );
  await saveToken(
    resetPasswordToken,
    user.id,
    expires,
    TOKEN_TYPE.RESET_PASSWORD
  );
  return resetPasswordToken;
};

// Generate verify email token
const generateVerifyEmailToken = async (user) => {
  const expires = moment().add(
    process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
    "minutes"
  );
  const verifyEmailToken = generateToken(
    user.id,
    expires,
    TOKEN_TYPE.VERIFY_EMAIL
  );
  await saveToken(verifyEmailToken, user.id, expires, TOKEN_TYPE.VERIFY_EMAIL);
  return verifyEmailToken;
};

// Generate verify phone token
const generateVerifyPhoneToken = async (user) => {
  const expires = moment().add(
    process.env.JWT_VERIFY_PHONE_EXPIRATION_MINUTES,
    "minutes"
  );
  const verifyPhoneToken = String(Math.floor(100000 + Math.random() * 900000));
  await saveToken(verifyPhoneToken, user.id, expires, TOKEN_TYPE.VERIFY_PHONE);
  return verifyPhoneToken;
};

module.exports = {
  generateToken,
  saveToken,
  verifyToken,
  verify2FA,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  generateVerifyPhoneToken,
};

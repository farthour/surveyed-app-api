const { password } = require("./custom");
const Joi = require("joi");

const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required().messages({
      "string.empty": "First Name is required",
    }),
    lastName: Joi.string().required().messages({
      "string.empty": "Last Name is required",
    }),
    email: Joi.string()
      .required()
      .email({ tlds: { allow: false } })
      .messages({
        "string.empty": "Email is required",
        "string.email": "Email is invalid",
      }),
    password: Joi.string()
      .required()
      .custom(password)
      .messages({ "string.empty": "Password is required" }),
    acceptedTerms: Joi.boolean().valid(true).required().messages({
      "any.only": "Please accept our Terms and Conditions",
    }),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string()
      .required({ tlds: { allow: false } })
      .messages({
        "string.empty": "Email is required",
      }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
};

const logout = {};

const refreshTokens = {};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "Email is required",
      }),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string()
      .required()
      .custom(password)
      .messages({ "string.empty": "Please type your password" }),
  }),
};

const sendEmailVerification = {
  query: Joi.object().keys({
    isRegistration: Joi.boolean(),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const sendPhoneVerification = {};

const verifyPhone = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
  sendPhoneVerification,
  verifyPhone,
};

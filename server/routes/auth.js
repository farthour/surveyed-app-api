const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const authValidation = require("../validations/auth");

const authController = require("../controllers/auth");
const { validateMiddleware, authMiddleware } = require("../middlewares");

/**
 * Register User
 *
 * @endpoint /api/v1/auth/register
 */
router.post(
  "/register",
  validateMiddleware(authValidation.register),
  catchAsync(authController.register)
);

/**
 * Login User
 *
 * @endpoint /api/v1/auth/login
 */
router.post(
  "/login",
  validateMiddleware(authValidation.login),
  catchAsync(authController.login)
);

/**
 * Logout
 *
 * @endpoint /api/v1/auth/logout
 */
router.post(
  "/logout",
  validateMiddleware(authValidation.logout),
  catchAsync(authController.logout)
);

/**
 * Refresh token
 *
 * @endpoint /api/v1/auth/refresh-tokens
 */
router.post(
  "/refresh-tokens",
  validateMiddleware(authValidation.refreshTokens),
  catchAsync(authController.refreshTokens)
);

/**
 * Forget Password
 *
 * @endpoint /api/v1/auth/forgot-password
 */
router.post(
  "/forgot-password",
  validateMiddleware(authValidation.forgotPassword),
  catchAsync(authController.forgotPassword)
);

/**
 * Reset Password
 *
 * @endpoint /api/v1/auth/reset-password
 */
router.post(
  "/reset-password",
  validateMiddleware(authValidation.resetPassword),
  catchAsync(authController.resetPassword)
);

/**
 * Send Email Verification
 *
 * @endpoint /api/v1/auth/send-email-verification
 */
router.post(
  "/send-email-verification",
  authMiddleware(),
  validateMiddleware(authValidation.sendEmailVerification),
  catchAsync(authController.sendEmailVerification)
);

/**
 * Verify Email
 *
 * @endpoint /api/v1/auth/verify-email
 */
router.post(
  "/verify-email",
  validateMiddleware(authValidation.verifyEmail),
  catchAsync(authController.verifyEmail)
);

module.exports = router;

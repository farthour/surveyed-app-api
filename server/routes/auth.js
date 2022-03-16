const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const authValidation = require("../validations/auth");

const authController = require("../controllers/auth");
const { validateMiddleware } = require("../middlewares");

/**
 * Auth
 *
 * @endpoint /api/v1/auth/register
 */
router.post(
  "/register",
  validateMiddleware(authValidation.register),
  catchAsync(authController.register)
);

module.exports = router;

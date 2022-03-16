const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");

const authController = require("../controllers/auth");

/**
 * Auth
 *
 * @endpoint /api/v1/auth/register
 */
router.post("/register", catchAsync(authController.register));

module.exports = router;

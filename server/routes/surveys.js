const express = require("express");
const router = express.Router();

const catchAsync = require("../utils/catchAsync");

const surveyValidations = require("../validations/surveys");

const surveysController = require("../controllers/surveys");
const { validateMiddleware, authMiddleware } = require("../middlewares");

/**
 * Show all surveys
 *
 * @endpoint /api/v1/surveys
 */
router.get("/", authMiddleware(), catchAsync(surveysController.getAllSurveys));

/**
 * Create Survey
 *
 * @endpoint /api/v1/surveys/create
 */
router.post(
  "/create",
  authMiddleware(),
  validateMiddleware(surveyValidations.createSurvey),
  catchAsync(surveysController.createSurvey)
);

/**
 * Dummy Route
 *
 * @endpoint /api/v1/surveys/dummy
 */
router.post("/dummy", authMiddleware(), catchAsync(surveysController.dummy));

module.exports = router;

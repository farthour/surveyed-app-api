const httpStatus = require("http-status");

const surveyService = require("../services/surveys");
const { ApiError } = require("../utils");
const { global: globalMessages } = require("../config/messages");

const getAllSurveys = async (req, res) => {
  const surveys = await surveyService.getSurveysOfUser(req.user.id);

  res.status(httpStatus.OK).send({ surveys });
};

const createSurvey = async (req, res) => {
  const survey = await surveyService.createNewSurvey(req.user.id, req.body);

  if (!survey)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      globalMessages.error.internalServerError
    );

  return res.status(httpStatus.OK).send({ survey });
};

const dummy = (req, res) => {
  res.send({ messages: "Successfull", user: req.user });
};

module.exports = {
  getAllSurveys,
  createSurvey,
  dummy,
};

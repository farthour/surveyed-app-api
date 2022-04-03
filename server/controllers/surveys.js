const httpStatus = require("http-status");

const surveyService = require("../services/surveys");
const { ApiError } = require("../utils");
const {
  global: globalMessages,
  survey: surveyMessages,
} = require("../config/messages");

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

  return res.status(httpStatus.OK).send(survey);
};

const getSurveyDetails = async (req, res) => {
  const survey = await surveyService.getSurveyDetailsById(req.params.id);

  if (!survey)
    throw new ApiError(
      httpStatus.NOT_FOUND,
      surveyMessages.error.surveyNotFound
    );
  return res.status(httpStatus.FOUND).send(survey);
};

const createSurveyQuestion = async (req, res) => {
  const question = await surveyService.createQuestionOfSurvey(
    req.params.id,
    req.body
  );

  if (!question)
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      globalMessages.error.internalServerError
    );

  return res.status(httpStatus.OK).send(question);
};

const dummy = (req, res) => {
  res.send({ messages: "Successfull", user: req.user });
};

module.exports = {
  getAllSurveys,
  createSurvey,
  getSurveyDetails,
  createSurveyQuestion,
  dummy,
};

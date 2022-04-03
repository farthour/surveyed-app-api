const asyncWaterfall = require("async/waterfall");
const httpStatus = require("http-status");

const logger = require("../config/logger");
const { ApiError } = require("../utils");
const Surveys = require("../models/surveys");
const Questions = require("../models/question");
const QuestionResponse = require("../models/questionResponse");
const { survey: surveyMessages } = require("../config/messages");

const getSurveysOfUser = async (userId) => {
  return await Surveys.find({ created_by: userId }, { created_by: 0 });
};

const createNewSurvey = async (userId, payload) => {
  return await Surveys.create({
    ...payload,
    created_by: userId,
  });
};

const getSurveyDetailsById = async (id) => {
  return await Surveys.findById(id, "-created_by").populate(
    "questions",
    "title description identifier"
  );
};

const createQuestionOfSurvey = async (surveyId, question) => {
  // Create responses
  const createResponses = (callback) => {
    (async function () {
      const responses = await QuestionResponse.insertMany(question.responses);
      if (!responses) callback(surveyMessages.error.creatingQuestionResponse);
      else callback(null, responses);
    })();
  };

  // Create question and add response ids
  const createQuestion = (responses, callback) => {
    (async function () {
      const responseIds = responses.map((v) => v._id);
      question.responses = responseIds;
      const q = await Questions.create(question);
      if (!q) callback(surveyMessages.error.creatingQuestion);
      else callback(null, q.id);
    })();
  };

  // Add question id to survey
  const addQuestionIdToSurvey = (questionId, callback) => {
    (async function () {
      const survey = await Surveys.findOneAndUpdate(
        { _id: surveyId },
        { $push: { questions: questionId } },
        { new: true, fields: "questions" }
      ).populate({ path: "questions", populate: { path: "responses" } });
      if (!survey) callback(surveyMessages.error.addingQuestionToSurvey);

      const question = survey.questions.filter((v) => v.id === questionId)[0];

      callback(null, question);
    })();
  };

  return asyncWaterfall([
    createResponses,
    createQuestion,
    addQuestionIdToSurvey,
  ])
    .then((data) => {
      return data;
    })
    .catch((err) => {
      logger.error(err);
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        surveyMessages.error.creatingQuestion
      );
    });
};

module.exports = {
  getSurveysOfUser,
  createNewSurvey,
  getSurveyDetailsById,
  createQuestionOfSurvey,
};

const Surveys = require("../models/surveys");

const getSurveysOfUser = async (userId) => {
  return await Surveys.find({ created_by: userId }, { created_by: 0 });
};

const createNewSurvey = async (userId, payload) => {
  return await Surveys.create({
    ...payload,
    created_by: userId,
  });
};

module.exports = { getSurveysOfUser, createNewSurvey };

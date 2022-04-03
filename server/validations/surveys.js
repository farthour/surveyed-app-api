const Joi = require("joi");

const questionResponseSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().optional().allow(""),
  identifier: Joi.string().required().messages({
    "string.empty": "Question Identifier is required",
  }),
  image_url: Joi.string().optional().allow(""),
  next_question_identifier: Joi.string().optional().allow(""),
});

const questionSchema = Joi.object().keys({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string().optional().allow(""),
  identifier: Joi.string().required().messages({
    "string.empty": "Question Identifier is required",
  }),
  response_display_type: Joi.string()
    .valid("horizontal", "vertical")
    .required()
    .messages({}),
  response_display_style: Joi.object(),
  response_display_shape: Joi.valid("circle", "card_default")
    .default("card_default")
    .required(),
  response_interaction_format: Joi.valid(
    "input",
    "dropdown",
    "select",
    null
  ).allow(""),
  type: Joi.valid("text", "email", "password", null, ""),
  placeholder: Joi.string().optional().allow(""),
  submit_btn_text: Joi.string().optional().allow("", null),
  continue_btn_text: Joi.string().optional().allow("", null),
  maximum_selections: Joi.number().min(1).messages({}),
  continue_after_delay: Joi.number().optional().allow("", null),
  responses: Joi.array().items(questionResponseSchema),
  redirect_url: Joi.string().optional().allow(""),
  is_initial_step: Joi.boolean(),
});

const createSurvey = {
  body: Joi.object().keys({
    title: Joi.string().required().messages({
      "string.empty": "Title is required",
    }),
    description: Joi.string().optional().allow(""),
    questions: [questionSchema],
  }),
};

const getSurveyQuestions = {
  params: Joi.object().keys({
    id: Joi.string().required().messages({
      "string.empty": "Survey Id not passed",
    }),
  }),
};

const createSurveyQuestion = {
  params: Joi.object().keys({
    id: Joi.string().required().messages({
      "string.empty": "Survey Id not passed",
    }),
  }),
  body: questionSchema,
};

module.exports = {
  createSurvey,
  getSurveyQuestions,
  createSurveyQuestion,
};

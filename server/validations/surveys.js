const Joi = require("joi");

const questionResponseSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string(),
  identifier: Joi.string().required().messages({
    "string.empty": "Question Identifier is required",
  }),
  image_url: Joi.string(),
  next_question_identifier: Joi.string(),
});

const questionSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.empty": "Title is required",
  }),
  description: Joi.string(),
  identifier: Joi.string().required().messages({
    "string.empty": "Question Identifier is required",
  }),
  response_display_type: Joi.valid("horizontal", "vertical")
    .required()
    .messages({}),
  response_display_style: Joi.object(),
  response_interaction_format: Joi.valid("input", "dropdown", "select", null),
  type: Joi.valid("text", "email", "password", null),

  placeholder: Joi.string(),
  submit_btn_text: Joi.string(),
  continue_btn_text: Joi.string(),
  maximum_selections: Joi.number()
    .min(1)
    .messages({}),
  continue_after_delay: Joi.number(),
  responses: [questionResponseSchema],
  redirect_url: Joi.string(),
  is_initial_step: Joi.boolean(),
});

const createSurvey = {
  body: Joi.object().keys({
    title: Joi.string().required().messages({
      "string.empty": "Title is required",
    }),
    description: Joi.string(),
    questions: [questionSchema]
  }),
};

module.exports = {
  createSurvey,
};

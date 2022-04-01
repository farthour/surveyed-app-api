const { Schema, model } = require("mongoose");
const validator = require("validator");

const { toJSON } = require("./plugins");

const questionResponseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  identifier: {
    type: String,
    required: true,
  },
  image_url: {
    type: String,
  },
  next_question_identifier: {
    type: Schema.Types.ObjectId,
    ref: "Question",
    populate: {
      select: "identifier",
    },
  },
});

questionResponseSchema.plugin(toJSON);

module.exports = model("QuestionResponse", questionResponseSchema);

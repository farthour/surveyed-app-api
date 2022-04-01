const { Schema, model } = require("mongoose");
const validator = require("validator");

const { toJSON } = require("./plugins");

const surveySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  created_by: {
    type: Schema.Types.ObjectId,
    ref: "User"
  }
});

surveySchema.plugin(toJSON);

module.exports = model("Survey", surveySchema);

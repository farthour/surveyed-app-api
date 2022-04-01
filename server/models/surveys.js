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
});

surveySchema.plugin(toJSON);

module.exports = model("Survey", surveySchema);

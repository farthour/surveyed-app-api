const { Schema, model } = require("mongoose");
const validator = require("validator");

const { toJSON } = require("./plugins");

const questionSchema = new Schema(
  {
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
    response_display_type: {
      type: String,
      enum: ["horizontal", "vertical"],
      required: true,
    },
    response_display_shape: {
      type: String,
      enum: ["circle", "card_default"],
      required: true,
    },
    response_display_style: {
      type: Object,
    },
    response_interaction_format: {
      type: String,
      enum: ["input", "dropdown", "select", null, ""],
      required: true,
    },
    type: {
      type: String,
      enum: ["text", "email", "password", null, ""],
      required: function (value) {
        if (this.response_interaction_format === "input") return true;
        return false;
      },
    },
    placeholder: {
      type: String,
    },
    submit_btn_text: {
      type: String,
    },
    continue_btn_text: {
      type: String,
    },
    maximum_selections: {
      type: Number,
      required: true,
      default: 1,
    },
    continue_after_delay: {
      type: Number,
    },
    responses: [
      { type: Schema.Types.ObjectId, ref: "QuestionResponse", required: true },
    ],
    redirect_url: {
      type: String,
    },
    is_initial_step: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.plugin(toJSON);

module.exports = model("Question", questionSchema);

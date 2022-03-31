const { Schema, model } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const { toJSON } = require("./plugins");
const { roles } = require("../config/roles");

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email");
      }
    },
  },
  phone: {
    type: String,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isMobilePhone(value)) {
        throw new Error("Invalid phone");
      }
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    validate(value) {
      if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        throw new Error(
          "Password must contain at least one letter and one number"
        );
      }
    },
    private: true, // used by the toJSON plugin
  },
  type: {
    type: String,
    enum: roles,
    default: "MEMBER",
  },
  acceptedTerms: {
    type: Boolean,
    required: true,
    default: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.plugin(toJSON);

// Check if email is taken
userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

// Check if password matches the users password
userSchema.methods.isPasswordMatch = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Hash user's password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

module.exports = model("User", userSchema);

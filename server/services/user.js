const httpStatus = require("http-status");

const User = require("../models/user");
const ApiError = require("../utils/ApiError");
const authMessages = require("../config/messages").auth;

const createUser = async (payload) => {
  // Check if email exists
  if (await User.isEmailTaken(payload.email)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      authMessages.error.emailAlreadyTaken
    );
  }

  return await User.create(payload);
};

const getUserByEmail = async (email) => await User.findOne({ email });

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, authMessages.error.userNotFound);
  }
  return user;
};

const updateUserById = async (userId, payload) => {
  const user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, authMessages.error.userNotFound);
  }

  if (payload.email) {
    if (await User.isEmailTaken(payload.email)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        authMessages.error.emailAlreadyTaken
      );
    }
  }

  if (payload.newPassword) {
    if (await !user.isPasswordMatch(payload.password)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        authMessages.error.incorrectPassword
      );
    }
    payload.password = payload.newPassword;
    delete payload.newPassword;
  }

  if (payload.resetPassword) {
    payload.password = payload.resetPassword;
    delete payload.resetPassword;
  }

  Object.assign(user, payload);
  await user.save();
  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserById,
};

const httpStatus = require("http-status");
const cookie = require("cookie");

const tokenService = require("../services/tokens");
const userService = require("../services/user");
const authService = require("../services/auth");
const emailService = require("../services/email.nodemailer");
const { ApiError } = require("../utils");
const authMessages = require("../config/messages").auth;

const register = async (req, res) => {
  // save user details to db
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);

  // Send email to verify account
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendEmailVerification(user.email, verifyEmailToken, true);

  // send access token and refresh token
  // with user details back to user
  res.status(httpStatus.CREATED).setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", tokens.refresh.token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    })
  );
  res.send({ accessToken: tokens.access.token, user });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.login(email, password);
  const tokens = await tokenService.generateAuthTokens(user);

  // send access token and refresh token
  // with user details back to user
  res
    .setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", tokens.refresh.token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    )
    .send({ accessToken: tokens.access.token, user });
};

const logout = async (req, res) => {
  if (!req.headers.cookie) {
    res.status(httpStatus.NO_CONTENT).send();
    return;
  }
  const cookies = cookie.parse(req.headers.cookie);
  await authService.logout(cookies.refreshToken);
  res.clearCookie("refreshToken");
  res.status(httpStatus.NO_CONTENT).send();
};

const refreshTokens = async (req, res) => {
  try {
    const cookies = cookie.parse(req.headers.cookie);
    const { tokens, user } = await authService.refreshAuth(
      cookies.refreshToken
    );
    res
      .setHeader(
        "Set-Cookie",
        cookie.serialize("refreshToken", tokens.refresh.token, {
          httpOnly: true,
          maxAge: 60 * 60 * 24 * 7,
          path: "/",
        })
      )
      .send({ accessToken: tokens.access.token, user });
  } catch (error) {
    res.clearCookie("refreshToken").status(httpStatus.UNAUTHORIZED).end();
  }
};

const forgotPassword = async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(
    req.body.email
  );
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const resetPassword = async (req, res) => {
  console.log("1");
  const user = await authService.resetPassword(
    String(req.query.token),
    req.body.password
  );
  console.log("2");
  const tokens = await tokenService.generateAuthTokens(user);
  console.log("3");
  res
    .setHeader(
      "Set-Cookie",
      cookie.serialize("refreshToken", tokens.refresh.token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      })
    )
    .send({ accessToken: tokens.access.token, user });
};

const sendEmailVerification = async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, authMessages.error.userNotFound);
  }

  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendEmailVerification(
    user.email,
    verifyEmailToken,
    req.query.isRegistration === "true" ? true : false
  );
  res.status(httpStatus.NO_CONTENT).send();
};

const verifyEmail = async (req, res) => {
  const user = await authService.verifyEmail(String(req.query.token));
  res.send({ user });
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendEmailVerification,
  verifyEmail,
};

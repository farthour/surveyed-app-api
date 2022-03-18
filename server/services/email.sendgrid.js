const logger = require("../config/logger");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const templates = {
  reset_password: "d-917c90567305453e803970996b162cc5",
  verify_email: "d-bd191322745f41649610966d312a2677",
  welcome: "d-23744c483d50410c8732365c56f9fc7a",
  account_update: "d-59e5be9c04a34a8ea0e9b63c4780545a",
};

// Send an email
const sendEmail = async (email, templateName, templateData) => {
  const msg = {
    to: email,
    from: process.env.OWNPROP_EMAIL,
    templateId: templates[templateName],
    dynamic_template_data: templateData,
  };

  sgMail
    .send(msg)
    .then(() => {
      logger.info(`Email sent to ${email}`);
    })
    .catch((error) => {
      console.error(error.response.body);
    });
};

// Send reset password email
const sendResetPasswordEmail = async (email, token) => {
  const templateData = {
    email,
    redirect_url: `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
  };

  await sendEmail(email, "reset_password", templateData);
};

// Send verification email
const sendEmailVerification = async (email, token, isRegistration) => {
  const templateData = {
    redirect_url: `${process.env.FRONTEND_URL}/${
      isRegistration ? "register" : "account"
    }?token=${token}`,
  };

  await sendEmail(email, "verify_email", templateData);
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  const templateData = {
    firstName,
    redirect_url: `${process.env.FRONTEND_URL}`,
  };

  await sendEmail(email, "welcome", templateData);
};

// Send account update email (email, phone, password)
const sendAccountUpdateEmail = async (email, firstName, attribute) => {
  const templateData = {
    firstName,
    attribute,
    redirect_url: `${process.env.FRONTEND_URL}/account`,
  };

  await sendEmail(email, "account_update", templateData);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendEmailVerification,
  sendWelcomeEmail,
  sendAccountUpdateEmail,
};

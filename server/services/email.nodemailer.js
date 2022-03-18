const nodemailer = require("nodemailer");
const transporter = require("../config/nodemailer");

const logger = require("../config/logger");

// Send an email
const sendEmail = async (email, subject, text, html) => {
	logger.info(`Sending email for ${subject}`)
  const msg = {
    from: process.env.MAILER_EMAIL, // sender address
    to: email, // list of receivers
    subject, // Subject line
    text, // plain text body
    html, // html body
  };

  // send mail with defined transport object
  transporter
    .sendMail(msg)
    .then((info) => {
      logger.info(`Email sent to ${email}`);
      logger.info("Message sent: %s", info.messageId);

      // Preview only available when sending through an Ethereal account
      logger.info("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    })
    .catch((error) => {
			logger.error(error)
    });
};

// Send reset password email
const sendResetPasswordEmail = async (email, token) => {
  let textMessage = `Reset Password: ${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  let htmlMessage = `
  <h2>Reset Password</h2>
  <br />
  <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Click here to reset password</a>
  `;

  await sendEmail(email, "Reset Password", textMessage, htmlMessage);
};

// Send verification email
const sendEmailVerification = async (email, token, isRegistration) => {
  let textMessage = `Verify your email ${process.env.FRONTEND_URL}/${
    isRegistration ? "register" : "account"
  }?token=${token}`;

  let htmlMessage = `
  <h2>Verify your email</h2>
  <br />
  <a href="${process.env.FRONTEND_URL}/${
    isRegistration ? "register" : "account"
  }?token=${token}">Click here to Continue</a>
  `;

  await sendEmail(email, "Verify your email", textMessage, htmlMessage);
};

// Send welcome email
const sendWelcomeEmail = async (email, firstName) => {
  let textMessage = `Welcome ${firstName}, continue ${process.env.FRONTEND_URL}`;

  let htmlMessage = `
  <h2>Welcome ${firstName}</h2>
  <br />
  <a href="${process.env.FRONTEND_URL}">Click here to Continue</a>
  `;

  await sendEmail(email, "Welcome", textMessage, htmlMessage);
};

// Send account update email (email, phone, password)
const sendAccountUpdateEmail = async (email, firstName, attribute) => {
  let textMessage = `Hello ${firstName}, account updated with details ${JSON.stringify(
    attribute
  )}. Go to your account ${process.env.FRONTEND_URL}/account`;

  let htmlMessage = `
  <h2>Hello ${firstName}</h2>
  <br />
  
	<p>Account updated with details ${JSON.stringify(attribute)}</p>
	<p>Go to your account ${process.env.FRONTEND_URL}/account</p>
  `;

  await sendEmail(email, "Account Update", textMessage, htmlMessage);
};

module.exports = {
  sendEmail,
  sendResetPasswordEmail,
  sendEmailVerification,
  sendWelcomeEmail,
  sendAccountUpdateEmail,
};

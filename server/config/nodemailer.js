const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAILER_EMAIL, // generated ethereal user
    pass: process.env.MAILER_PASS, // generated ethereal password
  },
});

module.exports = transporter;

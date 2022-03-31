const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  // service: "Gmail", // Uncomment this if you are using Gmail service and comment host and port
  host: "smtp.ethereal.email",  // check emails at https://ethereal.email/
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.MAILER_EMAIL, // generated ethereal user
    pass: process.env.MAILER_PASS, // generated ethereal password
  },
});

module.exports = transporter;

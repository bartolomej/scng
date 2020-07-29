const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const winston = require('winston');

let logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'mail-service' },
  transports: [
    new winston.transports.Console
  ]
});

/**
 * Nodemailer is a email transporter library for Node.js.
 * [Nodemailer documentation](https://nodemailer.com/about/)
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.use('compile', hbs({
  viewEngine: {
    extname: '.handlebars',
    partialsDir: 'src/views',
    layoutsDir: 'src/views',
    defaultLayout: 'email',
  },
  viewPath: 'src/views',
}));

module.exports.send = async function (to, subject, title, text, attachments = []) {
  const message = {
    from: 'SCNG APP 📱' + '<' + process.env.EMAIL_USER + '>',
    to,
    subject,
    attachments,
    text, // plain text version of the message
    template: 'email',
    context: {
      title,
      text
    }
  };
  let info = await transporter.sendMail(message);

  logger.log({
    level: 'info',
    message: `Message sent ${info.messageId}`,
    description: `response: ${info.response}, to: ${info.envelope.to}`
  });

  return info;
};

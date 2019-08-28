const nodemailer = require('nodemailer');
const winston = require('winston');


let logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'news-service' },
  transports: [
    new winston.transports.Console
  ]
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

module.exports.send = async function (to, subject, text, html) {
  let info = await transporter.sendMail({
    from: '"SCNG APP 👻" <' + process.env.MAIL_USER + '>',
    to, subject, text, html
  });

  logger.log({
    level: 'info',
    message: `Message send ${info.messageId}`,
    description: `response: ${info.response}, to: ${info.envelope.to}`
  });
};
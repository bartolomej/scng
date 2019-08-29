const {saveSubscriber} = require('../db/user');
const {send} = require('../services/mail');
const winston = require('winston');


let logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console
  ]
});


module.exports.subscribe = async function (school, email) {
  let subscriber;
  try {
    subscriber = await saveSubscriber(email, school);
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Subscriber save failed`,
      description: e.message
    });
    return new Promise.reject(new Error("Subscription save failed"));
  }

  try {
    let mailInfo = await send('SCNG APP 👻', email,
      'Hejla, hvala da si se narocil na obvestila SCNG aplikacije.', '',
      '<div><h1>Hello this is a title</h1><p>This is a paragraph</p></div>'
    );
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Welcome email failed to send`,
      description: e.message
    });
    return new Promise.reject(new Error("Subscription mail failed to send"));
  }

  return subscriber;
};
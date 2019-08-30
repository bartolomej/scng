const {saveSubscriber, getSubscriber} = require('../db/user');
const {send} = require('./mail');
const winston = require('winston');


let logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console
  ]
});


module.exports.sendMessageToAdmin = async function (email, message) {
  /**
   * TODO: setup proper app initialization (admins, schools,..)
   */
  try {
    send(`SPOROCILO: ${email}`, email,
      'Hejla, hvala da si se narocil na obvestila SCNG aplikacije.', '',
      '<div><h1>Hello this is a title</h1><p>This is a paragraph</p></div>'
    );
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Welcome email failed to send`,
      description: e.message
    });
    return Promise.reject(new Error("Subscription mail failed to send"));
  }
};


module.exports.subscribe = async function (school, email) {
  let subscriber;

  try {
    let currentSubscriber = await getSubscriber(email);
    if (currentSubscriber) {
      return Promise.reject(new Error("Already subscribed"))
    }
  } catch (e) {}

  try {
    subscriber = await saveSubscriber(email, school);
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Subscriber save failed`,
      description: e.message
    });
    return Promise.reject(new Error("Subscription save failed"));
  }

  try {
    send('SCNG APP 📱👻', email,
      'Hejla, hvala da si se narocil na obvestila SCNG aplikacije.', '',
      '<div><h1>Hello this is a title</h1><p>This is a paragraph</p></div>'
    );
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Welcome email failed to send`,
      description: e.message
    });
    return Promise.reject(new Error("Subscription mail failed to send"));
  }

  return subscriber;
};
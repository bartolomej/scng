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

  try {
    send(process.env.ADMIN_EMAIL, `SPOROCILO`,
      `SPOROCILO UPORABNIKA ${email}`, message
    );
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Message to admin failed to send`,
      description: e.message
    });
    return Promise.reject(new Error("Message failed to send"));
  }

  return {
    status: 'ok',
    message: 'Message sent'
  }
};


module.exports.subscribe = async function (school, email) {

  try {
    let currentSubscriber = await getSubscriber(email);
    if (currentSubscriber) {
      return Promise.reject(new Error("Already subscribed"))
    }
  } catch (e) {}

  try {
    await saveSubscriber(email, school);
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Subscriber save failed`,
      description: e.message
    });
    return Promise.reject(new Error("Subscription save failed"));
  }

  try {
    send(email, 'OBVESTILO O NAROCANJU 👻',
      'OBVESTILO O NAROCANJU 👻',
      'Hejla, hvala da si se narocil na obvestila SCNG aplikacije.'
    );
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Welcome email failed to send`,
      description: e.message
    });
    return Promise.reject(new Error("Subscription mail failed to send"));
  }

  return {
    status: 'ok',
    message: 'Subscribed to news feed'
  }
};
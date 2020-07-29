const getRepository = require('typeorm').getRepository;
const uuid = require('uuid').v4;

module.exports.saveSubscriber = async function (email, school) {
  return await getRepository("Subscriber")
    .save({ id: uuid(), email, school, date: new Date() })
};

module.exports.getSubscriber = async function (email) {
  return await getRepository("Subscriber")
    .createQueryBuilder("s")
    .where("s.email = :email", { email })
    .getOne();
};

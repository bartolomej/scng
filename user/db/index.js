const getRepository = require('typeorm').getRepository;
const uuid = require('uuid/v4');

module.exports.saveReview = async function (title, description, classId) {
  return await getRepository("Review")
    .save({id: uuid(), title, description, classId, date: new Date()})
};

module.exports.saveNotification = async function (title, description) {
  return await getRepository("Notification")
    .save({id: uuid(), title, description, date: new Date()})
};

module.exports.getLatestNotification = async function () {
  return await getRepository("Notification")
    .createQueryBuilder("n")
    .where("visible = 1")
    .orderBy("date", "ASC")
    .getMany();
};

module.exports.getLatestReviews = async function () {
  return await getRepository("Review")
    .createQueryBuilder("r")
    .orderBy("r.date", "ASC")
    .getMany();
};
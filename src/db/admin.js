const getRepository = require('typeorm').getRepository;
const uuid = require('uuid/v4');

module.exports.saveReview = async function (description, type, user) {
  return await getRepository("Review")
    .save({id: uuid(), type, description, user, date: new Date()})
};

module.exports.saveFeature = async function (title, status) {
  return await getRepository("Feature")
    .save({id: uuid(), title, date: new Date(), status})
};

module.exports.updateSchool = async function (id, name, fullName, homeUrl, timetableUrl, logo, siteVersion) {
  return await getRepository("School")
    .createQueryBuilder()
    .update("School")
    .set({name, fullName, homeUrl, timetableUrl, logo, siteVersion})
    .where("id = :id", {id})
    .execute();
};

module.exports.updateFeature = async function (id, status, title, description, visible) {
  return await getRepository("Feature")
    .createQueryBuilder()
    .update("Feature")
    .set({status, title, description, visible})
    .where("id = :id", {id})
    .execute();
};

module.exports.getLatestReviews = async function () {
  return await getRepository("Review")
    .createQueryBuilder("r")
    .orderBy("r.date", "ASC")
    .getMany();
};
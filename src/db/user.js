const getRepository = require('typeorm').getRepository;
const {ConflictError} = require('../errors');
const uuid = require('uuid/v4');


module.exports.saveFeatureSuggestion = async function (title, user) {
  return await getRepository("Feature")
    .save({id: uuid(), title, date: new Date(), user})
};

module.exports.saveFeatureVote = async function (featureId, user) {
  let vote = await getRepository("FeatureVote")
    .createQueryBuilder("v")
    .where("v.feature = :featureId", {featureId})
    .andWhere("v.user = :user", {user})
    .getOne();
  if (vote) {
    return Promise.reject(new ConflictError('You already voted for feature ' + featureId))
  }
  return await getRepository("FeatureVote")
    .save({feature: featureId, date: new Date(), user})
};

module.exports.getFeatureSuggestions = async function () {
  return await getRepository("FeatureVote")
    .createQueryBuilder("fv")
    .select("f.id, f.title, f.description, f.status, count(fv.date) as votes")
    .innerJoin("fv.feature", "f")
    .where("f.visible = 1")
    .groupBy('f.id, f.title, f.description, f.status')
    .orderBy("votes", "ASC")
    .getRawMany();
};
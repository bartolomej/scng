const getRepository = require('typeorm').getRepository;
const uuid = require('uuid/v4');
const {ConflictError} = require('../errors');


module.exports.saveSubscriber = async function (mail, school) {
  return await getRepository("Subscriber")
    .save({id: uuid(), mail, school, date: new Date()})
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
  return await getRepository("Feature").query(
    `select f.id, f.title, f.status, f.date, count(fv.date) as votes from feature_vote fv 
    right join feature f on fv.featureId = f.id group by f.id, f.title, f.status, f.date`
  );
};
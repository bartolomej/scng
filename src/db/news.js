const getRepository = require('typeorm').getRepository;
const moment = require('moment');

module.exports.save = async function (school, title, content, href, date) {
  return await getRepository("Article")
    .save({ school, title, content, href, date: moment(date).format("YYYY-MM-DD HH:mm:ss") });
};

module.exports.getLatest = async function (limit = 20) {
  return await getRepository("Article")
    .createQueryBuilder("article")
    .innerJoinAndMapOne('article.school', 'article.school', 'school')
    .orderBy("date", "DESC")
    .limit(limit)
    .getMany();
};

module.exports.getSchools = async function () {
  return await getRepository("School")
    .createQueryBuilder("s")
    .where('1 = 1')
    .getMany();
};

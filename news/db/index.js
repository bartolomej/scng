const getRepository = require('typeorm').getRepository;

module.exports.save = async function (title, content, date) {
  await getRepository("News").save({
    title,
    content,
    date: date.toString()
  });
};

module.exports.getLatest = async function (limit) {
  return await getRepository("News")
    .createQueryBuilder("news")
    .orderBy("date", "DESC")
    .limit(limit)
    .getMany();
};
const getRepository = require('typeorm').getRepository;

module.exports.save = async function (title, content, href, date) {
  await getRepository("News").save({
    title,
    content,
    href,
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
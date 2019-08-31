const getRepository = require('typeorm').getRepository;


module.exports.updateSchool = async function (id, name, fullName, homeUrl, timetableUrl, logo, siteVersion) {
  return await getRepository("School")
    .createQueryBuilder()
    .update("School")
    .set({name, fullName, homeUrl, timetableUrl, logo, siteVersion})
    .where("id = :id", {id})
    .execute();
};

module.exports.getSubscribers = async function () {
  return await getRepository("Subscriber")
    .createQueryBuilder("r")
    .orderBy("r.date", "ASC")
    .getMany();
};
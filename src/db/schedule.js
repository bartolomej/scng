const getRepository = require('typeorm').getRepository;

module.exports.saveSchool = async function (id, name, fullName, homeUrl, timetableUrl, logo, siteVersion) {
  return await getRepository("School")
    .save({ id, name, fullName, homeUrl, timetableUrl, added: new Date(), logo, siteVersion });
};

module.exports.saveClass = async function (id, name, school) {
  return await getRepository("Class")
    .save({ id, name, school });
};

module.exports.saveTimetable = async function (id, date, hourIndex, classId) {
  return await getRepository("Timetable")
    .save({ id, date, hourIndex, 'class': classId });
};

module.exports.saveLesson = async function (id, timetable, type, start, end, fullName, shortName, teacher, classRoom, group) {
  return await getRepository("Lesson")
    .save({ id, timetable, type, start, end, fullName, shortName, teacher, classRoom, group });
};

module.exports.getSchools = async function () {
  return await getRepository("School")
    .createQueryBuilder("school")
    .where('1=1')
    .getMany();
};

module.exports.getAllClasses = async function () {
  return await getRepository("Class")
    .createQueryBuilder("class")
    .innerJoinAndSelect("class.school", "school")
    .where('1 = 1')
    .getMany();
};

module.exports.getClasses = async function (schoolId) {
  return await getRepository("Class")
    .createQueryBuilder("class")
    .where('class.school = :schoolId', { schoolId })
    .getMany();
};

module.exports.getClassWithSchool = async function (classId) {
  return await getRepository("Class")
    .createQueryBuilder("class")
    .innerJoinAndSelect("class.school", "school")
    .where('class.id = :classId', { classId })
    .getOne();
};

module.exports.getClass = async function (classId) {
  return await getRepository("Class")
    .createQueryBuilder("class")
    .where('class.id = :classId', { classId })
    .getOne();
};

module.exports.getTimetableByDay = async function (classId, date) {
  return await getRepository("Timetable")
    .createQueryBuilder("timetable")
    .where('timetable.classId = :classId', { classId })
    .andWhere('timetable.date = :date', { date })
    .addOrderBy('timetable.hourIndex', 'ASC')
    .getMany();
};

module.exports.getLessonByTimetable = async function (timetableId) {
  return await getRepository("Lesson")
    .createQueryBuilder("lesson")
    .where('lesson.timetable = :timetableId', { timetableId })
    .getMany();
};

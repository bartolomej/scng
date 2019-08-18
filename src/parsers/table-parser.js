const moment = require('moment');
const crypto = require('crypto');
const {saveLesson, saveTimetable} = require('../db/schedule');


module.exports.serializeTimetable = async function (table, classId) {
  for (let d = 0; d < 5; d++) {
    let date = parseDate(table[0][d].date);
    for (let l = 1; l < table.length; l++) {
      let {start, end} = parsePeriod(table[l][0].period, date);
      let lessons = table[l][d+1];
      let timetableId = hash(date.format('DD-MM-YYYY') + (l - 1) + classId);
      await saveTimetable(timetableId, date.toDate(), l - 1, classId);
      lessons.forEach(async lesson => {
        let lessonId = hash(timetableId + lesson.shortName);
        await saveLesson(
          lessonId,
          timetableId,
          lesson.type,
          start.toDate(), end.toDate(),
          lesson.fullName,
          lesson.shortName,
          lesson.teacher,
          lesson.classRoom,
          lesson.group
        );
      });
    }
  }
};

function parsePeriod(period, date) {
  let p = period.split(' - ').map(t => t.split(':'));
  let start = moment(date);
  start.hours(Number.parseInt(p[0][0]));
  start.minutes(Number.parseInt(p[0][1]));
  start.seconds(0);
  let end = moment(date);
  end.hours(Number.parseInt(p[1][0]));
  end.minutes(Number.parseInt(p[1][1]));
  end.seconds(0);
  return {start, end};
}

function parseDate(date) {
  let parsed = date.replace(' ', '').split('.');
  let m = moment();
  m.date(Number.parseInt(parsed[0]));
  m.month(Number.parseInt(parsed[1]));
  return m;
}

function hash(string) {
  return crypto.createHash('md5')
    .update(string).digest('hex');
}
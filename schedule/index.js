require('reflect-metadata');
const moment = require('moment');
const uuid = require('uuid/v4');
const schedule = require('node-schedule');
const createConnection = require('typeorm').createConnection;

const {parseScheduleTable, parseClasses} = require('./parser');
const request = require('../utils/request');
const {getSchools, saveClass, getAllClasses, saveSchool, saveLesson, saveTimetable} = require('./db/index');


async function init() {
  const connection = await createConnection();
  await connection.synchronize();

  schedule.scheduleJob({
    hour: 20,
    minute: 0,
  }, async () => await fetchNewSchedule());

  await fetchClasses();
  await fetchNewSchedule();
}

async function fetchNewSchedule() {
  let classes = await getAllClasses();
  classes.forEach(async cl => {
    let week = moment().week();
    let schedule = await fetchSchedule(cl.school.id, cl.id, week);
    try {
      await parseTimetable(schedule, cl.id);
    } catch (e) {
      console.error('timetable parse failed ', e.message);
      console.log(e)
    }
  })
}

async function fetchClasses() {
  let schools = await getSchools();
  schools.forEach(async school => {
    let response = await request.get(school.url);
    let classes = parseClasses(response);
    try {
      await saveSchool(
        school.id,
        school.name,
        school.fullName
      );
    } catch (e) {
      console.error('failed to save school ', e.message);
    }
    classes.forEach(async schoolClass => {
      try {
        await saveClass(
          schoolClass.id,
          schoolClass.name,
          school.id
        )
      } catch (e) {
        console.error('failed to save class ', e.message);
      }
    })
  });
}

async function parseTimetable(table, classId) {
  for (let d = 0; d < 5; d++) {
    let date = parseDate(table[0][d].date);
    for (let l = 1; l < table.length; l++) {
      let {start, end} = parsePeriod(table[l][0].period, date);
      let lessons = table[l][d+1];
      await saveTimetable(uuid(), date.toDate(), l - 1, classId);
      lessons.forEach(async lesson => {
        await saveLesson(
          uuid(), lesson.type,
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
}

async function fetchSchedule(schoolId, classId, week, studentId = 0) {
  const SCHEDULE_API_ENDPOINT = 'https://www.easistent.com/urniki/ajax_urnik';
  const REQUEST_BODY =
    `id_sola=${schoolId}&` +
    `id_razred=${classId}&` +
    `id_dijak=${studentId}&` +
    `teden=${week}&qversion=17`;

  return parseScheduleTable(
    await request.post(SCHEDULE_API_ENDPOINT, REQUEST_BODY, 'form'));
}

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

module.exports = {
  init,
};
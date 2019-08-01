require('reflect-metadata');
const moment = require('moment');
const schedule = require('node-schedule');
const {parseScheduleTable, parseClasses} = require('./htmlParser');
const request = require('../utils/request');
const {getSchools, saveClass, getAllClasses} = require('./db/index');
const {serializeTimetable} = require('./tableParser');
const {env} = require('../app.json');


async function init() {
  if (env === 'production') {
    schedule.scheduleJob({
      hour: 20,
      minute: 0,
    }, async () => await fetchNewSchedule());
  }

  await fetchClasses();
  await fetchNewSchedule();
}

async function fetchNewSchedule() {
  let classes = await getAllClasses();
  classes.forEach(async cl => {
    let week = moment().week() + 17;
    let schedule = await fetchSchedule(cl.school.id, cl.id, week);
    try {
      await serializeTimetable(schedule, cl.id);
    } catch (e) {
      console.error('timetable parse failed ', e.message);
    }
  })
}

async function fetchClasses() {
  let schools = await getSchools();
  schools.forEach(async school => {
    if (school.timetableUrl === '') return;
    let response;
    try {
      response = await request.get(school.timetableUrl);
    } catch (e) {
      console.error('school timetable fetch failed ', e.message);
      console.log(school);
      return;
    }
    parseClasses(response).forEach(async schoolClass => {
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

module.exports = {
  init,
  fetchSchedule
};
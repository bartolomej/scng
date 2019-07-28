require('reflect-metadata');
const moment = require('moment');
const schedule = require('node-schedule');
const createConnection = require('typeorm').createConnection;

const {parseScheduleTable, parseClasses} = require('./htmlParser');
const request = require('../utils/request');
const {getSchools, saveClass, getAllClasses} = require('./db/index');
const {serializeTimetable} = require('./tableParser');
const {env} = require('../app.json');


async function init() {
  const connection = await createConnection();
  await connection.synchronize();

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
    let week = moment().week();
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
    let response = await request.get(school.timetableUrl);
    let classes = parseClasses(response);
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
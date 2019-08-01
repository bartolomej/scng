require('reflect-metadata');
const moment = require('moment');
const winston = require('winston');
const schedule = require('node-schedule');
const {parseScheduleTable, parseClasses} = require('./htmlParser');
const request = require('../utils/request');
const {getSchools, saveClass, getAllClasses} = require('./db/index');
const {serializeTimetable} = require('./tableParser');
const {env} = require('../app.json');


let logger;

async function init() {
  if (env === 'production') {
    schedule.scheduleJob({
      hour: 20,
      minute: 0,
    }, async () => await fetchNewSchedule());
  }

  logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'schedule-service' },
    transports: [
      //
      // - Write to all logs with level `info` and below to `combined.log`
      // - Write all logs error (and below) to `error.log`.
      //
      new winston.transports.File({ filename: 'log/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'log/combined.log' })
    ]
  });

  await fetchClasses();
  await fetchNewSchedule();
}

async function fetchNewSchedule() {
  let classes = await getAllClasses();

  logger.log({
    level: 'info',
    message: `Fetching schedules for ${classes.length} classes`
  });

  classes.forEach(async cl => {
    let week = moment().week() + 17;
    let schedule = await fetchSchedule(cl.school.id, cl.id, week);

    try {
      await serializeTimetable(schedule, cl.id);
    } catch (e) {
      console.error(`Parse timetable for class ${cl.id} failed ${e.message}`);
      logger.log({
        level: 'error',
        message: `Parse timetable for class ${cl.id} failed ${e.message}`
      });
    }
  });
}

async function fetchClasses() {
  let schools = await getSchools();
  schools.forEach(async school => {
    if (school.timetableUrl === '') return;

    logger.log({
      level: 'info',
      message: `Fetching class for ${school.timetableUrl}`
    });

    let response;
    try {
      response = await request.get(school.timetableUrl);
    } catch (e) {
      console.error(`Fetching school ${school.id} timetable failed ${e.message}`);
      logger.log({
        level: 'error',
        message: `Fetching school ${school.id} timetable failed ${e.message}`
      });
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
        console.error(`Saving class ${schoolClass.id} save failed ${e.message}`);
        logger.log({
          level: 'error',
          message: `Saving class ${schoolClass.id} save failed ${e.message}`
        });
      }
    });
  });
}

async function fetchSchedule(schoolId, classId, week, studentId = 0) {
  const SCHEDULE_API_ENDPOINT = 'https://www.easistent.com/urniki/ajax_urnik';
  const REQUEST_BODY =
    `id_sola=${schoolId}&` + `id_razred=${classId}&` +
    `id_dijak=${studentId}&` + `teden=${week}&qversion=17`;
  return parseScheduleTable(
    await request.post(SCHEDULE_API_ENDPOINT, REQUEST_BODY, 'form'));
}

module.exports = {
  init,
  fetchSchedule
};
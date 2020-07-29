require('reflect-metadata');
const fetch = require('node-fetch');
const moment = require('moment');
const winston = require('winston');
const { parseScheduleTable, parseClasses } = require('../parsers/schedule-parser');
const { getSchools, saveClass, getAllClasses } = require('../db/schedule');
const { saveTimetable } = require('../parsers/table-serializer');

let logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'schedule-service' },
  transports: [
    new winston.transports.Console
  ]
});

async function fetchNewSchedule () {
  // fetch n weeks of schedule in advance
  const WEEKS_IN_ADVANCE = 3;
  let classes = await getAllClasses();

  logger.log({
    level: 'info',
    message: `Fetching schedules for ${classes.length} classes`
  });

  classes.forEach(async cl => {
    let week = moment().diff(moment('02.09.2019', 'DD.MM.YYYY'), 'week') + 1;
    for (let i = 0; i < WEEKS_IN_ADVANCE; i++) {
      let response = await fetchSchedule(cl.school.id, cl.id, week + i);
      let schedule = parseScheduleTable(response);
      try {
        await saveTimetable(schedule, cl.id);
        logger.log({
          level: 'info',
          message: `Saved timetable`,
          description: `school: ${cl.school.id}, class: ${cl.id}, week: ${week + i}`
        });
      } catch (e) {
        logger.log({
          level: 'error',
          message: `Parsing timetable failed`,
          description: `school: ${cl.school.id}, class: ${cl.id}`,
          errorMessage: e.message,
          stack: e.stack
        });
      }
    }
  });
}

async function fetchClasses () {
  let schools = await getSchools();
  schools.forEach(async school => {
    if (school.timetableUrl === '') {
      return;
    }
    logger.log({
      level: 'info',
      message: `Fetching classes`,
      description: `school: ${school.id}`
    });

    let schedulePage;
    try {
      let response = await fetch(school.timetableUrl);
      schedulePage = await response.text();
    } catch (e) {
      logger.log({
        level: 'error',
        message: `Fetching classes failed`,
        description: `school: ${school.id}`,
        errorMessage: e.message,
        stack: e.stack
      });
      return;
    }

    parseClasses(schedulePage).forEach(async schoolClass => {
      let { id, name } = schoolClass;
      try {
        await saveClass(id, name, school.id);
        logger.log({
          level: 'error',
          message: `Saved class`,
          description: `school: ${school.id}, class: ${schoolClass.id}`
        });
      } catch (e) {
        logger.log({
          level: 'error',
          message: `Saving class failed`,
          description: `school: ${school.id}, class: ${schoolClass.id}`,
          errorMessage: e.message,
          stack: e.stack
        });
      }
    });
  });
}

async function fetchSchedule (schoolId, classId, week, studentId = 0) {
  const response = await fetch('https://www.easistent.com/urniki/ajax_urnik', {
    method: 'POST',
    body: `id_sola=${schoolId}&` +
      `id_razred=${classId}&` +
      `id_dijak=${studentId}&` +
      `teden=${week}&qversion=17`,
    headers: { 'Content-Type': `application/x-www-form-urlencoded` }
  });
  return await response.text();
}

module.exports = {
  fetchSchedule,
  fetchClasses,
  fetchNewSchedule
};

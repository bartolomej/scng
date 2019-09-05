const app = require('express').Router();
const moment = require('moment');
const {fetchSchedule} = require('../services/schedule');
const {
  getSchools,
  getClasses,
  getLessonByTimetable,
  getTimetableByDay,
  getClassWithSchool
} = require('../db/schedule');


app.get('/school', async (req, res, next) => {
  try {
    res.send(await getSchools());
  } catch (e) { next(e) }
});

app.get('/school/:schoolId', async (req, res, next) => {
  try {
    res.send(await getClasses(req.params.schoolId));
  } catch (e) { next(e) }
});

app.get('/schedule/:classId', async (req, res, next) => {
  if (req.query.period) {
    let weekPeriod = Number.parseInt(req.query.period);
    let schedule = [];
    for (let i = 0; i < weekPeriod; i++) {
      let startWeekDay = moment().add(i, 'week').day(0);
      let endWeekDay = moment().add(i, 'week').day(4);
      try {
        schedule.push(await getMultipleSchedule(
          req.params.classId,
          startWeekDay,
          endWeekDay
        ));
      } catch (e) { next(e) }
    }
    res.send(schedule);
  } else {
    let startWeekDay = moment().day(0);
    let endWeekDay = moment().day(4);
    try {
      res.send(await getMultipleSchedule(
        req.params.classId,
        startWeekDay,
        endWeekDay
      ));
    } catch (e) { next(e) }
  }
});

app.get('/schedule/:classId/html', async (req, res, next) => {
  let week = moment().diff(moment('02.09.2019', 'DD.MM.YYYY'), 'week') + 1;
  let schoolClass = await getClassWithSchool(req.params.classId);
  let html = await fetchSchedule(schoolClass.school.id, req.params.classId, week);
  try {
    res.send(html);
  } catch (e) { next(e) }
});



async function getMultipleSchedule(classId, startDate, endDate) {
  let timetable = [];
  let diff = moment(endDate).diff(moment(startDate), 'days');
  for (let i = 1; i <= diff + 1; i++) {
    let currentDate = moment(startDate).add(i, 'day').format('YYYY-MM-DD');
    timetable.push(await getSchedule(classId, currentDate));
  }
  return timetable;
}

async function getSchedule(classId, date) {
  let timetables = await getTimetableByDay(classId, date);
  let timetable = {date, lessons: []};
  for (let i = 0; i < timetables.length; i++) {
    let index = timetables[i].hourIndex;
    let groups = await getLessonByTimetable(timetables[i].id);
    timetable.lessons.push({index, groups});
  }
  return timetable;
}

module.exports = app;
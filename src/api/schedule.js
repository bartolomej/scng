const app = require('express').Router();
const moment = require('moment');
const {getSchools, getClasses, getLessonByTimetable, getTimetableByDay, getClassWithSchool} = require('../db/schedule');
const {fetchSchedule} = require('../services/schedule');


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
      // TODO: only for development
      let startWeekDay = moment('07-04-2019', 'DD-MM-YYYY').add(i, 'week').day(0);
      let endWeekDay = moment('12-04-2019', 'DD-MM-YYYY').add(i, 'week').day(4);
      try {
        schedule.push(await getMultipleSchedule(req.params.classId, startWeekDay, endWeekDay));
      } catch (e) { next(e) }
    }
    res.send(schedule);
  } else {
    let startWeekDay = moment().add(0, 'week').day(0);
    let endWeekDay = moment().add(0, 'week').day(4);
    try {
      res.send(await getMultipleSchedule(req.params.classId, startWeekDay, endWeekDay));
    } catch (e) { next(e) }
  }
});

app.get('/schedule/:classId/html', async (req, res, next) => {
  let week = 28;//moment().week() + 17;
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
    let currentDate = moment(startDate).add(i, 'day').toDate();
    timetable.push(await getSchedule(classId, currentDate));
  }
  return timetable;
}

async function getSchedule(classId, date) {
  let timetables = await getTimetableByDay(classId, date);
  let timetable = {date: date, lessons: []};
  for (let i = 0; i < timetables.length; i++) {
    let index = timetables[i].hourIndex;
    // TODO: not returning full group pairs ?
    let groups = await getLessonByTimetable(timetables[i].id);
    timetable.lessons.push({index, groups});
  }
  return timetable;
}

module.exports = app;
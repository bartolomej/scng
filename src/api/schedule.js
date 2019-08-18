const app = require('express').Router();
const moment = require('moment');
const {getSchools, getClasses, getLessonByTimetable, getTimetableByDay} = require('../db/schedule');


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
  let startWeekDay = moment().day(0);
  let endWeekDay = moment().day(5);
  try {
    res.send(await getMultipleSchedule(req.params.classId, startWeekDay, endWeekDay));
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
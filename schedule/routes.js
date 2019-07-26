const app = require('express').Router();
const moment = require('moment');
const {init} = require('./index');
const {getSchools, getClasses, getLessonByTimetable, getTimetableByDay} = require('./db/index');

(async () => await init())();

app.get('/', async (req, res, next) => {
  try {
    res.send(await getSchools());
  } catch (e) { next(e) }
});

app.get('/:schoolId', async (req, res, next) => {
  try {
    res.send(await getClasses(req.params.schoolId));
  } catch (e) { next(e) }
});

app.get('/table/:classId', async (req, res, next) => {
  let {start, end} = parseDates(req.query);
  try {
    res.send(await getSchedule(req.params.classId, start.toDate(), end.toDate()));
  } catch (e) { next(e) }
});

app.get('/test/:classId', async (req, res, next) => {
  let {start, end} = parseDates(req.query);
  try {
    res.send(await getSchedule(req.params.classId, start.toDate(), end.toDate()));
  } catch (e) { next(e) }
});

async function getSchedule(classId, date) {
  let timetables = await getTimetableByDay(classId, date);
  let timetable = {date: date, lessons: []};
  for (let i = 0; i < timetables.length; i++) {
    let index = timetables[i].hourIndex;
    // TODO: not returning full group pairs
    let groups = await getLessonByTimetable(timetables[i].id);
    timetable.lessons.push({index, groups});
  }
  return timetable;
}

function parseDates(query) {
  let start, end;
  if (query.start || query.end) {
    start = moment(query.start);
    end = moment(query.end);
  } else {
    start = moment().day(0);
    end = moment().day(7);
  }
  return {start, end};
}

module.exports = app;
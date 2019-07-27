const app = require('express').Router();
const moment = require('moment');
const {init} = require('./index');
const {ValidationError, NotFoundError, ConflictError} = require('../utils/errors');
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

app.get('/:classId', async (req, res, next) => {
  let date = moment(req.params.date);
  if (date.isValid()) {
    try {
      res.send(await getSchedule(req.params.classId, date.toDate()));
    } catch (e) { next(e) }
  } else {
    next(new ValidationError("Invalid date format"))
  }
});

app.get('/timetable/:classId/:date', async (req, res, next) => {
  let date = moment(req.params.date, 'DD-MM-YYYY');
  if (date.isValid()) {
    try {
      res.send(await getSchedule(req.params.classId, date.toDate()));
    } catch (e) { next(e) }
  } else {
    next(new ValidationError("Invalid date format"))
  }
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

module.exports = app;
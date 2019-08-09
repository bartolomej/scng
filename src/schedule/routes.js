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
  if (!date.isValid()) {
    return next(new ValidationError("Invalid date format"));
  }
  try {
    res.send(await getSchedule(req.params.classId, date.toDate()));
  } catch (e) { next(e) }
});

app.get('/timetable/:classId/:date', async (req, res, next) => {
  let date = moment(req.params.date, 'DD-MM-YYYY');
  if (!date.isValid()) {
    return next(new ValidationError("Invalid date format"));
  }
  try {
    res.send(await getSchedule(req.params.classId, date.toDate()));
  } catch (e) { next(e) }
});

app.get('/timetable/:classId', async (req, res, next) => {
  let startDate = moment(req.query.startDate, 'DD-MM-YYYY');
  let endDate = moment(req.query.endDate, 'DD-MM-YYYY');
  if (startDate.isValid() && endDate.isValid()) {
    try {
      res.send(await getMultipleSchedule(req.params.classId, startDate, endDate));
    } catch (e) { next(e) }
  } else {
    next(new ValidationError("Invalid date format in url"))
  }
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
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

app.get('/timetable/:classId/:date', async (req, res, next) => {
  let date = moment(req.params.date).toDate();
  try {
    res.send(await getSchedule(req.params.classId, date));
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

module.exports = app;
const app = require('express').Router();
const moment = require('moment');
const {init} = require('./index');
const {getSchools, getClasses, getSchedule} = require('./db/index');

(async () => await init())();

app.get('/', async (req, res, next) => {
  try {
    res.send(await getSchools());
  } catch (e) {
    res.send({
      code: 400,
      error: e.message
    })
  }
});

app.get('/:schoolId', async (req, res, next) => {
  try {
    res.send(await getClasses(req.params.schoolId));
  } catch (e) {
    res.send({
      code: 400,
      error: e.message
    })
  }
});

app.get('/table/:classId', async (req, res, next) => {
  let start, end;
  if (req.query.start || req.query.end) {
    start = moment(req.query.start);
    end = moment(req.query.end);
  } else {
    start = moment().day(0);
    end = moment().day(7);
  }
  try {
    res.send(await getSchedule(req.params.classId, start.toDate(), end.toDate()));
  } catch (e) {
    console.error(e)
    res.send({
      code: 400,
      error: e.toString()
    })
  }
});

module.exports = app;
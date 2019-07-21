const app = require('express').Router();
const schedule = require('./index');

(async function () {
  await schedule.init();
})();

app.get('/', async (req, res, next) => {
  res.send(await schedule.getSchedule('224', '343294'));
});

module.exports = app;
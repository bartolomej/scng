const app = require('express').Router();
const schedule = require('./index');

(async function () {
  await schedule.init();
})();

app.get('/', async (req, res, next) => {
  try {
    res.send(await schedule.getSchedule('224', '343294'));
  } catch (e) {
    res.send({
      code: 400,
      error: e.message
    })
  }
});

module.exports = app;
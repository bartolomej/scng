const schedule = require('node-schedule');
const {fetchNewSchedule, fetchClasses} = require('./services/schedule');
const {processNewsUpdates} = require('./services/news');

module.exports = async function () {

  if (process.env.NODE_ENV === 'production') {
    schedule.scheduleJob({
      hour: 20,
      minute: 0,
    }, async () => await fetchNewSchedule());
  }

  if (process.env.NODE_ENV === 'production') {
    schedule.scheduleJob({
      hour: 20,
      minute: 0,
    }, async () => await processNewsUpdates());
  }

  await fetchClasses();
  await fetchNewSchedule();
  await processNewsUpdates();
};
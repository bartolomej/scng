const schedule = require('node-schedule');
const {fetchNewSchedule, fetchClasses} = require('./services/schedule');
const {processUpdates} = require('./services/news');

module.exports = function () {

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
    }, async () => await processUpdates());
  }

};
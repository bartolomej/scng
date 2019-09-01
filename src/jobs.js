const schedule = require('node-schedule');
const fs = require('fs');
const path = require('path');
const {fetchNewSchedule, fetchClasses} = require('./services/schedule');
const {saveSchool} = require('./db/schedule');
const {processNewsUpdates} = require('./services/news');

module.exports = async function () {
  if (process.env.NODE_ENV !== 'development') {
    await initializeDb();
    await fetchClasses();
    await fetchNewSchedule();
    await processNewsUpdates();
    await registerWorkers();
  }
};

async function initializeDb() {
  let filePath = path.join(__dirname, 'schools.json');
  let schools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  schools.forEach(async school => {
    await saveSchool(
      school.id,
      school.name,
      school.fullName,
      school.homeUrl,
      school.timetableUrl,
      school.logo,
      school.siteVersion)
  });
}

async function registerWorkers() {
  schedule.scheduleJob({
    hour: 20,
    minute: 0,
  }, async () => await fetchNewSchedule());
  schedule.scheduleJob({
    hour: 20,
    minute: 0,
  }, async () => await processNewsUpdates());
}
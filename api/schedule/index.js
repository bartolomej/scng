const {parseScheduleTable, parseClasses} = require('./parser');
const request = require('../utils/request');
const moment = require('moment');
const fileDb = require('../utils/filedb');
const schedule = require('node-schedule');
const path = require('path');
const fs = require('fs').promises;


const STORE_PATH = path.join(__dirname, 'store');
const SCHEDULE_PATH = path.join(STORE_PATH, 'schedule');
const SCHOOLS_PATH = path.join(STORE_PATH, 'schools');


async function init() {
  try {await fs.mkdir(STORE_PATH)} catch (e) {}
  try {await fs.mkdir(SCHEDULE_PATH)} catch (e) {}
  try {await fs.mkdir(SCHOOLS_PATH)} catch (e) {}

  schedule.scheduleJob({
    hour: 20,
    minute: 0,
  }, async () => await fetchNewSchedule());

  await fetchClasses();
  await fetchNewSchedule();
}

async function getSchedule(schoolId, classId) {
  let PATH = path.join(SCHEDULE_PATH, schoolId, classId);
  let files = await fileDb.readAll(PATH);
  return files;
}

async function fetchNewSchedule() {
  let schools = await fileDb.readAll(SCHOOLS_PATH);
  schools.forEach(school => {
    school.classes.forEach(async cl => {
      let week = moment().week();
      let schedule = await fetchSchedule(school.id, cl.id, week);
      let PATH = path.join(SCHEDULE_PATH, school.id, cl.id);
      try {
        await fs.mkdir(PATH);
      } catch (e) {
        console.error('failed to create folder for schedule update ', e);
      }
      await fileDb.write(path.join(PATH, moment().unix() + '.json'), schedule);
    })
  })
}

async function fetchSchedule(schoolId, classId, week, studentId = 0) {
  const SCHEDULE_API_ENDPOINT = 'https://www.easistent.com/urniki/ajax_urnik';
  const REQUEST_BODY =
    `id_sola=${schoolId}&` +
    `id_razred=${classId}&` +
    `id_dijak=${studentId}&` +
    `teden=${week}&qversion=17`;

  return parseScheduleTable(
    await request.post(SCHEDULE_API_ENDPOINT, REQUEST_BODY, 'form'));
}

async function fetchClasses() {
  let schools = require('./schools');
  schools.forEach(async school => {
    let response = await request.get(school.url);
    let parsed = parseClasses(response);
    try {
      await fs.mkdir(path.join(SCHEDULE_PATH, school.id));
      await fileDb.write(
        path.join(SCHOOLS_PATH, `${school.name}.json`), {
          id: school.id,
          name: school.name,
          fullName: school.fullName,
          classes: parsed
        })
    } catch (e) {
      console.error('failed writing class ', e);
    }
  });
}

module.exports = {
  init,
  getSchedule
};
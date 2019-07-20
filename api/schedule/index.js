const {parseScheduleTable} = require('./parser');
const request = require('../utils/request');


async function getSchedule(schoolId, classId, week, studentId = 0) {
  const SCHEDULE_API_ENDPOINT = 'https://www.easistent.com/urniki/ajax_urnik';
  const REQUEST_BODY =
    `id_sola=${schoolId}&` +
    `id_razred=${classId}&` +
    `id_dijak=${studentId}&` +
    `teden=${week}&qversion=17`;

  let response = await request.post(SCHEDULE_API_ENDPOINT, REQUEST_BODY, 'form');

  return parseScheduleTable(response);
}

module.exports = {
  getSchedule
};
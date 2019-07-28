const moment = require('moment');
const {fetchSchedule} = require('../index');


describe('Scraper module integration tests', function () {

  it('should parse current schedule for 4.ra', async function () {
    const WEEK_INDEX = '41';
    const CLASS_ID = '343294';
    const SCNG_ID = '224';

    let parsed = await fetchSchedule(SCNG_ID, CLASS_ID, WEEK_INDEX);

    expect(parsed.length).toEqual(10);
    parsed.forEach(row => expect(row.length).toEqual(6));
  });

});
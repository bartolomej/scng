require('reflect-metadata');
const createConnection = require('typeorm').createConnection;

const {parseHomePageV1, parseArticlePageV1, parseDateV1, parseDateV2} = require('./htmlParser');
const schedule = require('node-schedule');
const {get} = require('../utils/request');
const {save, getSchools} = require('./db/index');
const {env} = require('../app.json');


async function init() {
  const connection = await createConnection();
  await connection.synchronize();

  if (env === 'production') {
    schedule.scheduleJob({
      hour: 20,
      minute: 0,
    }, async () => await processUpdates());
  }

  await processUpdates();
}

async function processUpdates() {
  let schools = await getSchools();
  schools.forEach(async school => {
    await updateArticles(
      school.id, school.homeUrl, school.siteVersion);
  });
}

async function updateArticles(schoolId, schoolPageLink, pageVersion) {
  let articles;
  let homePage;

  if (pageVersion !== 'v1') {
    throw new Error('v2 site not supported');
  }

  try {
    homePage = await get(schoolPageLink);
  } catch (e) {
    console.error('fetch failed ', e.message);
    return;
  }

  try {
    articles = parseHomePageV1(homePage);
  } catch (e) {
    console.error('parsing failed ', e.message);
    return;
  }

  articles.forEach(async article => {
    let html = await get(article.href);
    let content = parseArticlePageV1(html).content;

    let date;
    if (schoolPageLink.includes('ers')) {
      date = parseDateV2(article.date);
    } else {
      date = parseDateV1(article.date);
    }

    try {
      await save(schoolId, article.title, content, article.href, date);
    } catch (e) {
      console.log('article save failed ', e.message);
      console.log(e);
    }
  });
}

module.exports = {
  init,
  processUpdates
};
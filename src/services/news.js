require('reflect-metadata');
const {parseHomePageV1, parseArticlePageV1, parseDateV1, parseDateV2} = require('../parsers/news-parser');
const schedule = require('node-schedule');
const winston = require('winston');
const {get} = require('../utils/request');
const {save, getSchools} = require('../db/news');


let logger;

async function init() {
  if (process.env.NODE_ENV === 'production') {
    schedule.scheduleJob({
      hour: 20,
      minute: 0,
    }, async () => await processUpdates());
  }

  logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'news-service' },
    transports: [
      new winston.transports.Console
    ]
  });

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

  logger.log({
    level: 'info',
    message: `Updating articles for school ${schoolId} (${schoolPageLink})`
  });

  if (pageVersion !== 'v1') {
    throw new Error('v2 site not supported');
  }

  try {
    homePage = await get(schoolPageLink);
  } catch (e) {
    console.error(`Fetching article from ${schoolPageLink} failed ${e.message}`);
    logger.log({
      level: 'error',
      message: `Fetching article from ${schoolPageLink} failed ${e.message}`
    });
    return;
  }

  try {
    articles = parseHomePageV1(homePage);
  } catch (e) {
    console.error(`Parsing article from ${schoolPageLink} failed ${e.message}`);
    logger.log({
      level: 'error',
      message: `Parsing article from ${schoolPageLink} failed ${e.message}`
    });
    return;
  }

  articles.forEach(async article => {
    let html = await get(article.href);
    let {content} = parseArticlePageV1(html);

    let date;
    if (schoolPageLink.includes('ers')) {
      date = parseDateV2(article.date);
    } else {
      date = parseDateV1(article.date);
    }

    try {
      await save(schoolId, article.title, content, article.href, date);
    } catch (e) {
      console.error(`Saving article ${article.title} failed ${e.message}`);
      logger.log({
        level: 'error',
        message: `Saving article ${article.title} failed ${e.message}`
      });
    }
  });
}

module.exports = {
  init,
  processUpdates
};
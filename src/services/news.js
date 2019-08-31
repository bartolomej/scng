require('reflect-metadata');
const fetch = require('node-fetch');
const {parseHomePageV1, parseArticlePageV1, parseDateV1, parseDateV2} = require('../parsers/news-parser');
const winston = require('winston');
const {save, getSchools} = require('../db/news');


let logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'news-service' },
  transports: [
    new winston.transports.Console
  ]
});

async function processUpdates() {
  let schools = await getSchools();
  schools.forEach(async school => {
    try {
      await updateArticles(school.id, school.homeUrl, school.siteVersion);
    } catch (e) {
      logger.log({
        level: 'error',
        message: `Updating articles for school ${school.id} failed`,
        description: e.message,
        stack: e.stack
      });
    }
  });
}

async function updateArticles(schoolId, schoolPageLink, pageVersion) {
  let articles;
  let homePage;

  logger.log({
    level: 'info',
    message: `Updating articles for school ${schoolId}`,
    description: `School href: ${schoolPageLink}`
  });

  if (pageVersion !== 'v1') {
    throw new Error('v2 site not supported');
  }

  try {
    let response = await fetch(schoolPageLink);
    homePage = await response.text();
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Fetching article from ${schoolPageLink} failed`,
      description: e.message,
      stack: e.stack
    });
    return;
  }

  try {
    articles = parseHomePageV1(homePage);
  } catch (e) {
    logger.log({
      level: 'error',
      message: `Parsing article from ${schoolPageLink} failed`,
      description: e.message,
      stack: e.stack
    });
    return;
  }

  articles.forEach(async article => {
    let response = await fetch(article.href);
    let html = await response.text();
    let {content} = parseArticlePageV1(html);

    let date;
    if (schoolPageLink.includes('ers') ||
      schoolPageLink.includes('sets') ||
      schoolPageLink.includes('mic')) {
      date = parseDateV2(article.date);
    } else {
      date = parseDateV1(article.date);
    }

    try {
      await save(schoolId, article.title, content, article.href, date);
    } catch (e) {
      logger.log({
        level: 'error',
        message: `Saving article "${article.title}" failed`,
        description: e.message,
        stack: e.stack
      });
    }
  });
}

module.exports = {
  processNewsUpdates: processUpdates
};
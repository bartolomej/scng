const {parseHomePage, parseArticlePage} = require('./parser');
const schedule = require('node-schedule');
const fileDb = require('../utils/filedb');
const crypto = require('crypto');
const {get} = require('../utils/request');
const fs = require('fs').promises;
const moment = require('moment');
const path = require('path');

const STORE_PATH = path.join(__dirname, './store');


async function init() {
  try {
    await fs.mkdir(STORE_PATH);
  } catch (e) {}

  schedule.scheduleJob({
    hour: 20,
    minute: 0,
  }, async () => await fetchNewArticles());

  await fetchNewArticles();
}

async function getArticles(limit) {
  return await fileDb.readAll(STORE_PATH, JSON.parse);
}

async function fetchNewArticles() {
  let articles;
  try {
    let homePage = await get('https://www.scng.si/');
    articles = parseHomePage(homePage);
  } catch (e) {
    console.error('fetch failed ', e);
  }
  articles.forEach(async article => {
    let fullArticle = parseArticlePage(await get(article.href));
    let fileName = path.join(STORE_PATH,
      `${moment(article.date).unix()}_${hash(article.title)}.json`);
    try {
      await fileDb.write(fileName, {
        title: article.title,
        date: article.date,
        content: fullArticle.content
      });
    } catch (e) {
      console.error('error on save article ', e);
    }
  });
}

function hash(text) {
  let formatted = text
    .replace(/ /g, '-')
    .replace('.', '')
    .toLowerCase();
  return crypto.createHash('md5')
    .update(formatted)
    .digest('hex');
}

module.exports = {
  init,
  getArticles,
  fetchNewArticles
};
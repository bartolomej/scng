const {parseHomePage, parseArticlePage} = require('./parser');
const schedule = require('node-schedule');
const fileDb = require('../utils/filedb');
const crypto = require('crypto');
const {get} = require('../utils/request');
const fs = require('fs').promises;
const path = require('path');

const STORE_PATH = path.join(__dirname, './store');


async function init() {
  try {
    await fs.mkdir(STORE_PATH);
  } catch (e) {}
  schedule.scheduleJob({
    hour: 20,
    minute: 0,
  }, async () => await updateArticles());
}

async function updateArticles() {
  let articles = await fetchLiveArticles();
  articles.forEach(async article => {
    let fullArticle = await fetchArticle(article.href);
    await saveArticle({
      title: article.title,
      date: article.date,
      content: fullArticle.text
    });
  });
}

async function fetchLiveArticles() {
  let homePage = await get('https://www.scng.si/');
  return parseHomePage(homePage);
}

async function fetchArticle(articleHref) {
  let articlePage = await get(articleHref);
  return parseArticlePage(articlePage);
}

async function saveArticle(article) {
  let fileName = hash(article.title) + '.json';
  try {
    await fileDb.write(
      path.join(STORE_PATH, fileName),
      JSON.stringify(article, null, 4)
    );
  } catch (e) {
    console.error(e);
  }
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
  updateArticles,
  fetchArticle,
  fetchLiveArticles
};
require('reflect-metadata');
const createConnection = require('typeorm').createConnection;
const crypto = require('crypto');
const fs = require('fs').promises;
const moment = require('moment');
const path = require('path');

const {parseHomePage, parseArticlePage} = require('./parser');
const schedule = require('node-schedule');
const fileDb = require('../utils/filedb');
const {get} = require('../utils/request');
const {save} = require('./db/index');

const STORE_PATH = path.join(__dirname, './store');


async function init() {
  try {
    await fs.mkdir(STORE_PATH);
  } catch (e) {}

  createConnection()
    .then(() => console.log("News DB connection created!"))
    .catch(error => console.log(error));

  schedule.scheduleJob({
    hour: 20,
    minute: 0,
  }, async () => await fetchNewArticles());

  await fetchNewArticles();
}

async function fetchNewArticles() {
  let articles;
  try {
    let homePage = await get('https://www.scng.si/');
    articles = parseHomePage(homePage);
  } catch (e) {
    console.error('fetch failed ', e.message);
  }

  articles.forEach(async article => {
    let content = parseArticlePage(
      await get(article.href)).content;
    try {
      await save(article.title, content, article.date);
    } catch (e) {
      console.log('article save failed ', e.message);
    }
  });
}

module.exports = {
  init,
  fetchNewArticles
};
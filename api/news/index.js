const {parseHomePage, parseArticlePage} = require('./parser');
const {get} = require('../utils/request');


async function getAvailableArticles() {
  let homePage = await get('https://www.scng.si/');
  return parseHomePage(homePage);
}

async function getArticle(articleHref) {
  let articlePage = await get(articleHref);
  return parseArticlePage(articlePage);
}

module.exports = {
  getArticle,
  getAvailableArticles
};
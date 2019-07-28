const $ = require('cheerio');
const moment = require('moment');

/**
 * home page parsing support for
 * scng.si, ers.scng.si like websites
 */
module.exports.parseHomePageV1 = function (html) {
  let articles = [];
  const exists = title => {
    articles.forEach(ele => {
      if (ele.title === title) return true;
    });
  };
  const articleContainer = $('div.row', html);
  $('div.widget-article', articleContainer).each((i, article) => {
    const content = $('div.content', article);
    const title = formatText($('h4.title', content).text());
    const date = formatDate($('div.date', content).text());
    const href = formatText($('a.main-button', article).attr('href'));
    if (!exists(title)) articles.push({date, title, href});
  });
  return articles;
};

/**
 * article page parsing support for
 * scng.si, ers.scng.si like websites
 */
module.exports.parseArticlePageV1 = function (html) {
  const content = $('div.row', html);
  return {
    title: formatText($('h1.title', content).text()),
    content: formatText($('div.main-content', content).text()),
  }
};

function formatText(text) {
  return text
    .replace(/\n/g, ' ')
    .replace(/\t/g, '')
    .replace(/^\s+|\s+$|\s+(?=\s)/g, '');
}

function formatDate(dateString) {
  let date = dateString.replace(/ /g, '');
  return moment(date, 'DD.MM.YYYY');
}
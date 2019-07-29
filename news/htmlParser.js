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
    const title = formatTitle($('h4.title', content).text()); // TODO: test formatTitle before commit v1
    const date = removeWhitespace($('div.date', content).text());
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

/**
 * pares date format 15.4.2018
 * found in scng.si
 */
module.exports.parseDateV1 = function (dateString) {
  let date = dateString.replace(/ /g, '');
  return moment(date, 'DD.MM.YYYY');
};

/**
 * parses date format 15.april,2019
 * found in ers.scng.si
 */
module.exports.parseDateV2 = function (dateString) {
  const months = [
    'januar',
    'februar',
    'marec',
    'april',
    'maj',
    'junij',
    'julij',
    'avgust',
    'september',
    'oktober',
    'november',
    'december'
  ];
  let dateParts = dateString.split(/[,.]/);
  return moment({
    year: Number.parseInt(dateParts[2]),
    month: months.indexOf(dateParts[1])+1,
    day: Number.parseInt(dateParts[0])
  });
};

function formatText(text) {
  return text
    .replace(/\n/g, ' ')
    .replace(/\t/g, '')
    .replace(/^\s+|\s+$|\s+(?=\s)/g, '');
}

function formatTitle(title) {
  let parts = formatText(title).split(/\s+/);
  for (let i = 0; i < parts.length; i++) {
    parts[i] = parts[i].toLowerCase();
    if (i === 0) {
      parts[i] = parts[i].charAt(0).toUpperCase() +
        parts[i].substring(1, parts[i].length);
    }
  }
  let result = '';
  for (let i = 0; i < parts.length; i++) {
    result += `${i === 0 ? '' : ' '}${parts[i]}`;
  }
  return result;
}

function removeWhitespace(text) {
  return text.replace(/ */g, '');
}

module.exports.test = {
  formatTitle
};
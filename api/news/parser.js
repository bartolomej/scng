const $ = require('cheerio');


module.exports.parseHomePage = function (html) {
  let articles = [];
  const exists = title => {
    let isTrue = false;
    articles.forEach(ele => {
      if (ele.title === title) isTrue = true;
    });
    return isTrue;
  };
  const articleContainer = $('div.row', html);
  $('div.widget-article', articleContainer).each((i, article) => {
    const content = $('div.content', article);
    const title = formatText($('h4.title', content).text());
    const date = $('div.date', content).text();
    const href = $('a.main-button', article).attr('href');
    if (!exists(title)) articles.push({date, title, href});
  });
  return articles;
};

module.exports.parseArticlePage = function (html) {
  const content = $('div.row', html);
  return {
    title: formatText($('h1.title', content).text()),
    text: formatText($('div.main-content', content).text()),
  }
};

function formatText(text) {
  return text
    .replace(/\n/g, ' ')
    .replace(/\t/g, '')
    .replace(/^\s+|\s+$|\s+(?=\s)/g, '');
}
const app = require('express').Router();
const news = require('./index');

(async function () {
  await news.init();
})();

app.get('/', async (req, res, next) => {
  res.send(await news.getArticles());
});

module.exports = app;
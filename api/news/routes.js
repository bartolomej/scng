const app = require('express').Router();

app.get('/', (req, res, next) => {
  res.send('News root')
});

module.exports = app;
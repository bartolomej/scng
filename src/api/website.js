const app = require('express').Router();
const {getSchools} = require('../db/news');
const {getReposDetails} = require('../services/github');

app.get('/', async (req, res) => {
  res.render('home', {
    layout: false,
    schools: await getSchools(),
    stats: await getReposDetails()
  });
});

module.exports = app;
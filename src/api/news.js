const app = require('express').Router();
const {getLatest, getSchools} = require('../db/news');
const {NotFoundError} = require('../errors');
const fs = require('fs');
const path = require('path');


app.get('/', async (req, res, next) => {
  res.send(await getLatest(10));
});

app.get('/logo/:id', async (req, res, next) => {
  let stream = fs.createReadStream(path.join(__dirname, '..', '..', 'assets', req.params.id));
  stream.on('open', () => {
    res.set('Content-Type', 'image/png');
    stream.pipe(res);
  });
  stream.on('error', () => {
    res.set('Content-Type', 'text/plain');
    next(new NotFoundError(`Image ${req.params.id} not found`))
  });
});



module.exports = app;
const app = require('express').Router();
const {getLatest, getSchools} = require('./db/index');
const {ValidationError, NotFoundError, ConflictError} = require('../utils/errors');
const {init} = require('./index');
const fs = require('fs');
const path = require('path');


(async () => {await init()})();

app.get('/', async (req, res, next) => {
  res.send(await getLatest(10));
});

app.get('/logo/:id', async (req, res, next) => {
  let stream = fs.createReadStream(path.join(__dirname, 'assets', req.params.id));
  stream.on('open', () => {
    res.set('Content-Type', 'image/png');
    stream.pipe(res);
  });
  stream.on('error', () => {
    res.set('Content-Type', 'text/plain');
    next(new NotFoundError("Image not found"))
  });
});



module.exports = app;
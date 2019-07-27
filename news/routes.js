const app = require('express').Router();
const {getLatest} = require('./db/index');
const {ValidationError, NotFoundError, ConflictError} = require('../utils/errors');
const {init} = require('./index');

(async () => {await init()})();

app.get('/', async (req, res, next) => {
  res.send(await getLatest(10));
});

module.exports = app;
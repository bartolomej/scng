const app = require('express').Router();
const {saveNotification, saveReview, getLatestReviews, getLatestNotification} = require('./db/index');
const {ValidationError, NotFoundError, ConflictError} = require('../utils/errors');
const {init} = require('./index');

(async () => await init())();

app.post('/review', async (req, res, next) => {
  if (req.body && req.body.title && req.body.description && req.body.classId) {
    res.send(await saveReview(req.body.title, req.body.description, req.body.classId));
  } else {
    next(new ValidationError("Request body parameters invalid"))
  }
});

app.post('/notification', async (req, res, next) => {
  if (req.body && req.body.title && req.body.description && req.body.shortDescription) {
    res.send(await saveNotification(req.body.title, req.body.description, req.body.shortDescription));
  } else {
    next(new ValidationError("Request body parameters invalid"))
  }
});

app.get('/review', async (req, res, next) => {
  res.send(await getLatestReviews());
});

app.get('/notification', async (req, res, next) => {
  res.send(await getLatestNotification());
});

module.exports = app;
const app = require('express').Router();
const {saveNotification, saveReview, getLatestReviews, getLatestNotification, saveMobileLog} = require('./db/index');
const {ValidationError, NotFoundError, ConflictError} = require('../utils/errors');
const {init} = require('./index');

(async () => await init())();

app.post('/feedback', async (req, res, next) => {
  if (!req.body || !req.body.title || !req.body.description || !req.body.classId) {
    return next(new ValidationError("Request body parameters invalid"))
  }
  try {
    res.send(await saveReview(req.body.type, req.body.description, req.body.classId));
  } catch (e) { next(e) }
});

app.post('/notification', async (req, res, next) => {
  if (!req.body || !req.body.title || !req.body.description) {
    return next(new ValidationError("Request body parameters invalid"))
  }
  try {
    res.send(await saveNotification(req.body.title, req.body.description));
  } catch (e) { next(e) }
});

app.post('/log', async (req, res, next) => {
  if (!req.body || !req.body.type || !req.body.description || !req.body.date || !req.body.user) {
    return next(new ValidationError("Request body parameters invalid"))
  }
  try {
    res.send(await saveMobileLog(req.body.type, req.body.description, req.body.date, req.body.user));
  } catch (e) { next(e) }
});

app.get('/review', async (req, res, next) => {
  res.send(await getLatestReviews());
});

app.get('/notification', async (req, res, next) => {
  res.send(await getLatestNotification());
});

module.exports = app;
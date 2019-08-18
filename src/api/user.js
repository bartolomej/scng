const app = require('express').Router();
const {saveReview, getLatestReviews, getLatestNotification, saveMobileLog} = require('../db/admin');
const { celebrate, Joi, errors } = require('celebrate');


app.post('/feedback', celebrate({
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    classId: Joi.string()
  })
}), async (req, res, next) => {
  try {
    res.send(await saveReview(req.body.type, req.body.description, req.body.classId));
  } catch (e) { next(e) }
});

app.post('/log', celebrate({
  body: Joi.object().keys({
    type: Joi.string(),
    description: Joi.string(),
    date: Joi.string(),
    user: Joi.string()
  })
}), async (req, res, next) => {
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

app.use(errors());

module.exports = app;
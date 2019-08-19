const app = require('express').Router();
const {celebrate, Joi, errors} = require('celebrate');
const {
  saveReview,
  getLatestReviews,
  getLatestNotification,
} = require('../db/admin');
const {
  saveFeatureSuggestion,
  saveFeatureVote,
  getFeatureSuggestions
} = require('../db/user');


app.get('/review', async (req, res, next) => {
  res.send(await getLatestReviews());
});

app.get('/notification', async (req, res, next) => {
  res.send(await getLatestNotification());
});

app.get('/feature', async (req, res, next) => {
  res.send(await getFeatureSuggestions());
});

app.post('/feature', celebrate({
  body: Joi.object().keys({
    title: Joi.string(),
    user: Joi.string(),
  })
}), async (req, res, next) => {
  try {
    res.send(await saveFeatureSuggestion(
      req.body.title,
      req.body.user
    ));
  } catch (e) { next(e) }
});

app.post('/feature/:id/vote', celebrate({
  body: Joi.object().keys({
    user: Joi.string(),
  })
}), async (req, res, next) => {
  try {
    res.send(await saveFeatureVote(
      req.params.id,
      req.body.user
    ));
  } catch (e) { next(e) }
});

app.post('/feedback', celebrate({
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    classId: Joi.string()
  })
}), async (req, res, next) => {
  try {
    res.send(await saveReview(
      req.body.type,
      req.body.description,
      req.body.classId
    ));
  } catch (e) { next(e) }
});

app.use(errors());

module.exports = app;
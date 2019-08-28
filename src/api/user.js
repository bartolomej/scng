const app = require('express').Router();
const {celebrate, Joi, errors} = require('celebrate');
const {send} = require('../services/mail');
const {
  saveReview,
  getLatestReviews,
} = require('../db/admin');
const {
  saveFeatureVote,
  getFeatureSuggestions,
  saveSubscriber
} = require('../db/user');


app.get('/review', async (req, res, next) => {
  res.send(await getLatestReviews());
});

app.get('/feature', async (req, res, next) => {
  res.send(await getFeatureSuggestions());
});

app.post('/subscribe', celebrate({
  body: Joi.object().keys({
    mail: Joi.string(),
    school: Joi.string(),
  })
}),async (req, res, next) => {
  await saveSubscriber(req.body.mail, req.body.school);
  await send(req.body.mail, 'Test', '', '<div><h1>Hello this is a title</h1><p>This is a paragraph</p></div>');
  res.send({status: 'ok'})
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
    description: Joi.string(),
    type: Joi.string(),
    user: Joi.string()
  })
}), async (req, res, next) => {
  try {
    res.send(await saveReview(
      req.body.description,
      req.body.type,
      req.body.user
    ));
  } catch (e) { next(e) }
});

app.use(errors());

module.exports = app;
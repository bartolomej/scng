const app = require('express').Router();
const basicAuth = require('express-basic-auth');
const {saveNotification, getLatestReviews, getLatestNotification, getLatestMobileLog} = require('../db/admin');
const {saveSchool, getSchools} = require('../db/schedule');
const {getLatest} = require('../db/news');
const { celebrate, Joi, errors } = require('celebrate');


app.use(basicAuth({
  users: {
    'admin': 'password123',
  },
  unauthorizedResponse: req => {
    return {
      status: 'error',
      name: 'UnauthorizedError',
      message: req.auth ? `Credentials ${req.auth.user} : ${req.auth.password} rejected`
        : 'No credentials provided'
    }
  }
}));

app.get('/school', async (req, res, next) => {
  res.send(await getSchools());
});

app.get('/news', async (req, res, next) => {
  res.send(await getLatest());
});

app.get('/log', async (req, res, next) => {
  res.send(await getLatestMobileLog());
});

app.get('/notification', async (req, res, next) => {
  res.send(await getLatestNotification());
});

app.get('/reviews', async (req, res, next) => {
  res.send(await getLatestReviews());
});

app.post('/school', celebrate({
  body: Joi.object().keys({
    id: Joi.string(),
    name: Joi.string(),
    fullName: Joi.string(),
    homeUrl: Joi.string(),
    timetableUrl: Joi.string().allow(''),
    siteVersion: Joi.string(),
    logo: Joi.string()
  })
}), async (req, res, next) => {
  try {
    res.send(await saveSchool(
      req.body.id, req.body.name, req.body.homeUrl,
      req.body.timetableUrl, req.body.logo, req.body.siteVersion
    ));
  } catch (e) { next(e) }
});

app.post('/notification', celebrate({
  body: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
  })
}), async (req, res, next) => {
  try {
    res.send(await saveNotification(req.body.title, req.body.description));
  } catch (e) { next(e) }
});

app.use(errors());

module.exports = app;
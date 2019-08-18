const app = require('express').Router();
const basicAuth = require('express-basic-auth');
const path = require('path');
const {ConflictError, InternalError} = require('../errors');
const {saveSchool, getSchools} = require('../db/schedule');
const {getLatest} = require('../db/news');
const {celebrate, Joi, errors} = require('celebrate');
const {
  saveNotification,
  getLatestReviews,
  getLatestNotification,
  getLatestMobileLog,
  updateSchool
} = require('../db/admin');


app.use(basicAuth({
  users: {
    'admin': 'password123',
  },
  unauthorizedResponse: req => ({
    status: 'error',
    name: 'UnauthorizedError',
    message: req.auth ?
      `Credentials ${req.auth.user} : ${req.auth.password} rejected` :
      'No credentials provided'
  })
}));

app.get('/school', async (req, res) => {
  res.send(await getSchools());
});

app.get('/news', async (req, res) => {
  res.send(await getLatest());
});

app.get('/log', async (req, res) => {
  res.send(await getLatestMobileLog());
});

app.get('/notification', async (req, res) => {
  res.send(await getLatestNotification());
});

app.get('/reviews', async (req, res) => {
  res.send(await getLatestReviews());
});

app.put('/school/:schoolId', celebrate({
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
    res.send(await updateSchool(
      req.params.schoolId, req.body.name, req.body.fullName, req.body.homeUrl,
      req.body.timetableUrl, req.body.logo, req.body.siteVersion
    ));
  } catch (e) { next(e) }
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
      req.body.id, req.body.name, req.body.fullName, req.body.homeUrl,
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

app.post('/logo', celebrate({
  body: Joi.object().keys({
    fileName: Joi.string(),
  })
}), async (req, res, next) => {
  if (Object.keys(req.files).length === 0) {
    return next(new ConflictError('No files were uploaded'));
  }
  let file = req.files.file;
  file.mv(path.join(__dirname, '..', '..', 'assets', req.body.fileName), error => {
    if (error) {
      return next(new InternalError('Error saving files', error.message));
    }
    res.send({
      status: 'ok',
      message: 'Files uploaded'
    });
  });
});

app.use(errors());

module.exports = app;
const app = require('express').Router();
const basicAuth = require('express-basic-auth');
const {saveSchool, getSchools} = require('../db/schedule');
const {fetchNewSchedule, fetchClasses} = require('../services/schedule');
const {processNewsUpdates} = require('../services/news');
const {getLatest} = require('../db/news');
const {celebrate, Joi, errors} = require('celebrate');
const {updateSchool,} = require('../db/admin');
const {send} = require('../services/mail');


const schoolBody = celebrate({
  body: Joi.object().keys({
    id: Joi.string(),
    name: Joi.string(),
    fullName: Joi.string(),
    homeUrl: Joi.string(),
    timetableUrl: Joi.string().allow(''),
    siteVersion: Joi.string(),
    logo: Joi.string()
  })
});

const mailBody = celebrate({
  body: Joi.object().keys({
    to: Joi.string(),
    subject: Joi.string(),
    title: Joi.string(),
    text: Joi.string()
  })
});

app.use(basicAuth({
  users: {
    'admin': process.env.ADMIN_PASS,
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

app.post('/mail', mailBody, async (req, res) => {
  res.send(await send(req.body.to, req.body.subject, req.body.title, req.body.text))
});

app.post('/update', async (req, res) => {
  fetchNewSchedule();
  fetchClasses();
  processNewsUpdates();
  res.send({
    status: 'ok',
    message: 'Processing updates',
  })
});

app.put('/school/:schoolId', schoolBody, async (req, res, next) => {
  try {
    res.send(await updateSchool(
      req.params.schoolId,
      req.body.name,
      req.body.fullName,
      req.body.homeUrl,
      req.body.timetableUrl,
      req.body.logo,
      req.body.siteVersion
    ));
  } catch (e) { next(e) }
});

app.post('/school', schoolBody, async (req, res, next) => {
  try {
    res.send(await saveSchool(
      req.body.id,
      req.body.name,
      req.body.fullName,
      req.body.homeUrl,
      req.body.timetableUrl,
      req.body.logo,
      req.body.siteVersion
    ));
  } catch (e) { next(e) }
});

app.use(errors());

module.exports = app;
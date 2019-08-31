const app = require('express').Router();
const {celebrate, Joi, errors} = require('celebrate');
const {
  subscribe,
  sendMessageToAdmin
} = require('../services/user');


app.post('/subscribe', celebrate({
  body: Joi.object().keys({
    email: Joi.string(),
    school: Joi.string(),
  })
}), async (req, res, next) => {
  try {
    res.send(await subscribe(req.body.school, req.body.email));
  } catch (e) {next(e)}
});

app.post('/message', celebrate({
  body: Joi.object().keys({
    email: Joi.string(),
    message: Joi.string(),
  })
}), async (req, res, next) => {
  try {
    res.send(await sendMessageToAdmin(req.body.email, req.body.message));
  } catch (e) {next(e)}
});

app.use(errors());

module.exports = app;
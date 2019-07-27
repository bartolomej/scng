const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();
require("reflect-metadata");

app.use(logger('dev'));
app.use(bodyParser.json());

app.use('/news', require('./news/routes'));
app.use('/schedule', require('./schedule/routes'));
app.use('/user', require('./user/routes'));

app.use((err, req, res, next) => {
  res.status(err.statusCode ? err.statusCode : 400).send({
    status: 'error',
    message: err.message
  })
});

app.listen(3000, () => console.log(`App running on port 3000`));

module.exports = app;
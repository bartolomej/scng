const express = require('express');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const rfs = require('rotating-file-stream');
const log = require('why-is-node-running');
const {env} = require('./app.json');
const app = express();
require("reflect-metadata");

const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});

if (env === 'development') {
  setTimeout(() => {
    log() // logs out active handles that are keeping node running
  }, 100)
}

app.use(require('express-request-id')());
app.use(bodyParser.json());
app.enable("trust proxy");

morgan.token('id', req => req.id);
morgan.token('ip', req => req.headers['x-forwarded-for'] || req.connection.remoteAddress);

app.use(morgan(':id [:date[web]] :ip ":method :url" :status :response-time', {
  skip: () => env === 'development',
  stream: accessLogStream
}));

app.use(morgan('dev', {
  skip: () => env !== 'development',
}));

// TODO: use /api prefix for api routes
// TODO: add website
// TODO: add admin module
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
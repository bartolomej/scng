const createConnection = require('typeorm').createConnection;
const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const log = require('why-is-node-running');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const {ConnectionStringParser} = require("connection-string-parser");
const ormconfig = require('../ormconfig');
const app = express();
require("reflect-metadata");

const connectionStringParser = new ConnectionStringParser({
  scheme: "mysql",
  hosts: []
});

let connectionObject;
if (process.env.DATABASE_URL) {
  connectionObject = connectionStringParser.parse(process.env.DATABASE_URL);
}

createConnection(process.env.DATABASE_URL ?
  ormconfig.connectionString(connectionObject) :
  ormconfig.normal
).then(async () => {

  if (process.env.NODE_ENV === 'development') {
    setTimeout(() => {
      log() // logs out active handles that are keeping node running
    }, 100)
  }

  app.use(bodyParser.json());
  app.enable("trust proxy");

  // TODO: add website
  // TODO: add admin module
  app.get('/', (req, res) => res.send(cool()));
  app.get('/api', (req, res) => res.send('SCNG REST API'));
  app.use('/api/news', require('./news/routes'));
  app.use('/api/schedule', require('./schedule/routes'));
  app.use('/api/user', require('./user/routes'));

  app.use((err, req, res, next) => {
    res.status(err.statusCode ? err.statusCode : 400).send({
      status: 'error',
      message: err.message
    })
  });

  app.listen(process.env.PORT || 3000, () => console.log(`App running on port ${process.env.PORT || 3000}`));
}).catch(e => console.log(e));
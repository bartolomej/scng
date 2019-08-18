const createConnection = require('typeorm').createConnection;
const cool = require('cool-ascii-faces');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config({path: path.join(__dirname, '..', '.env')});
const {ConnectionStringParser} = require("connection-string-parser");
const {NotFoundError} = require('./utils/errors');
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

  app.use(bodyParser.json());
  app.enable("trust proxy");

  // TODO: add website
  // TODO: add admin module
  app.get('/', (req, res) => res.send(cool()));
  app.get('/api', (req, res) => res.send('SCNG REST API'));
  app.use('/api/admin', require('./api/admin'));
  app.use('/api/user', require('./api/user'));
  app.use('/api/news', require('./api/news'));
  app.use('/api/schedule', require('./api/schedule'));
  app.all('*', (req, res, next) => {
    next(new NotFoundError('Endpoint not found'))
  });

  app.use((err, req, res, next) => {
    res.status(err.statusCode ? err.statusCode : 400).send({
      status: 'error',
      name: err.name,
      message: err.message
    })
  });

  app.listen(process.env.PORT || 3000, error => {
    if (error) {
      console.error(error);
      process.exit(1);
      return;
    }
    console.log(`
    #######################################################
      🛡️  Server listening on port: ${process.env.PORT || 3000} 🛡️ 
    #######################################################
    `)
  });
}).catch(error => {
  console.error(error);
  process.exit(1);
});
require('reflect-metadata');
const moment = require('moment');
const schedule = require('node-schedule');
const createConnection = require('typeorm').createConnection;


async function init() {
  const connection = await createConnection();
  await connection.synchronize();
}

module.exports = {
  init,
};
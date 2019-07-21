const fs = require('fs');
const path = require('path');

async function readAll(dirname) {
  return new Promise((resolve, reject) => {
    fs.readdir(dirname, (err, filenames) => {
      if (err) {
        return reject(err);
      }
      return resolve(Promise.all(filenames.map(async filename => {
        const filePath = path.join(dirname, filename);
        return await read(filePath);
      })));
    });
  });
}

async function write(path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(data, null, 4), err => (
      err ? reject(err) : resolve(data)
    ))
  });
}

async function read(path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => (
      err ? reject(err) : resolve(JSON.parse(data))
    ))
  });
}

async function remove(path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      err ? reject(err) : resolve()
    })
  })
}

module.exports = {
  remove, read, write, readAll
};
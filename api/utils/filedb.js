const fs = require('fs');


module.exports.write = async function (path, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, err => (
      err ? reject(err) : resolve(data)
    ))
  });
};

module.exports.read = async function (path) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, 'utf-8', (err, data) => (
      err ? reject(err) : resolve(data)
    ))
  });
};

module.exports.remove = async function (path) {
  return new Promise((resolve, reject) => {
    fs.unlink(path, err => {
      err ? reject(err) : resolve()
    })
  })
};
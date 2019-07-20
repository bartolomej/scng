const axios = require('axios');

module.exports.post = function (url, body, encoding) {
  return new Promise((resolve, reject) => {
    axios.post(url, body, {
      headers: {
        'Content-Type': `application/${encoding === 'json' ? 'json' : 'x-www-form-urlencoded'}`
      }
    }).then(res =>
      resolve(res.data)).catch(reject);
  })
};

module.exports.get = function (url) {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(reject);
  })
};

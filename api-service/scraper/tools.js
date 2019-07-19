const cheerio = require('cheerio');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

module.exports.postRequest = function (url, body, encoding) {
  return new Promise((resolve, reject) => {
    axios.post(url, body, {
      headers: {
        'Content-Type': `application/${encoding === 'json' ? 'json' : 'x-www-form-urlencoded'}`
      }
    }).then(res =>
      resolve(res.data)).catch(reject);
  })
};

module.exports.getRequest = function (url) {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => resolve(res.data)).catch(reject);
  })
};

module.exports.getText = function (element, html) {
  const $ = cheerio.load(html);
  const elements = $(element);
  let values = [];
  for (let i = 0; i < elements.length; i++) {
    for (let j = 0; j < elements[i].children.length; j++) {
      if (elements[i].children[j].type === 'text') {
        values.push(elements[i].children[j].data);
      }
    }
  }
  return values;
};

module.exports.getValue = function (element, html) {
  const $ = cheerio.load(html);
  const elements = $(element);
  let values = [];
  for (let i = 0; i < elements.length; i++) {
    if (elements[i].attribs.value !== undefined) {
      values.push(elements[i].attribs.value)
    }
  }
  return values;
};

module.exports.getHtml = function (element, html) {
  const $ = cheerio.load(html);
  return $(element).html();
};

module.exports.getElements = function (element, html) {
  const $ = cheerio.load(html);
  return $(element);
};

module.exports.readFile = async function (filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, filePath),
      {encoding: 'utf-8'}, (err, data) => {
      err ? reject(err) : resolve(data)
    })
  })
};
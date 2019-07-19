const {getElements, getHtml, getValue, getText} = require('./tools');

const URNIKI_URL = 'https://www.easistent.com/urniki/';
const SCNG_ID = 'e29aeb36cd1efde89c2b2c28e33209813ec32756';


async function getClasses(html) {
  const RAZRED_SELECTOR_ID = 'id_parameter';
  const MATCHES_WHITESPACE = /([ ]{2,}(\r\n|\r|\n))|[ ]{2,}/;

  let classes = getHtml(`#${RAZRED_SELECTOR_ID}`, html);
  return classes.split(MATCHES_WHITESPACE)
    .filter(ele => ele !== '\n' && ele !== undefined && ele !== '')
    .map(optionEle => ({
      className: getText('option', optionEle)[0],
      classId: getValue('option', optionEle)[0]
    }))
}

module.exports = {
  getClasses
};
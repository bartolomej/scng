const tools = require('./tools');
const {readFile} = require('./tools');
const {getClasses} = require('./scraper');


describe('Scraping tools test', function () {

  it('should request html', async function () {
    let html = await tools.request('https://www.google.com/');
    expect(html);
  });

  it('should return element text by class', async function () {
    const html = '<div><h1 class="testClass">Test</h1></div>';
    const receivedText = tools.getText('.testClass', html);

    expect(receivedText).toEqual(['Test']);
  });

  it('should return element value by class', async function () {
    const html = `<select id="id_parameter" onchange="spremeni_urnik()" class="urnik-filter" autocomplete="off">\n
                  <option value="343294" selected="selected">1. AE</option>                            
                  <option value="343299">1. CE</option>`;

    const receivedText = tools.getValue('option', html);

    expect(receivedText).toEqual(['343294', '343299']);
  });

  it('should return elements text array by class', async function () {
    const html = `<select id="id_parameter" onchange="spremeni_urnik()" class="urnik-filter" autocomplete="off">\n
                  <option value="343294" selected="selected">1. AE</option>                            
                  <option value="343299">1. CE</option>`;

    const receivedText = tools.getText('option', html);

    expect(receivedText).toEqual(['1. AE', '1. CE']);
  });

});


const RAZRED_SELECTOR_ID = 'id_parameter';
const URNIKI_URL = 'https://www.easistent.com/urniki/';
const SCNG_ID = 'e29aeb36cd1efde89c2b2c28e33209813ec32756';

describe('Scraping functionality test', function () {

  it('should return classes object {name, id}', async function () {
    let html = await readFile('./testUrnik.html');
    let classes = await getClasses(html);

    expect(classes).toEqual([
      {
        "className": "1. AE",
        "classId": "343294"
      },
      {
        "className": "1. CE",
        "classId": "343299"
      },
      {
        "className": "1. NE",
        "classId": "343304"
      },
      {
        "className": "1. NR",
        "classId": "343309"
      },
      {
        "className": "1. RA",
        "classId": "343314"
      },
      {
        "className": "1. RB",
        "classId": "343319"
      },
      {
        "className": "1. RC",
        "classId": "343324"
      },
      {
        "className": "2. AE",
        "classId": "343259"
      },
      {
        "className": "2. CE",
        "classId": "343264"
      },
      {
        "className": "2. NE",
        "classId": "343269"
      },
      {
        "className": "2. NR",
        "classId": "343274"
      },
      {
        "className": "2. RA",
        "classId": "343279"
      },
      {
        "className": "2. RB",
        "classId": "343284"
      },
      {
        "className": "2. RC",
        "classId": "343289"
      },
      {
        "className": "3. AE",
        "classId": "343234"
      },
      {
        "className": "3. CE",
        "classId": "343239"
      },
      {
        "className": "3. RA",
        "classId": "343244"
      },
      {
        "className": "3. RB",
        "classId": "343249"
      },
      {
        "className": "3. RC",
        "classId": "343254"
      },
      {
        "className": "4. AE",
        "classId": "343219"
      },
      {
        "className": "4. RA",
        "classId": "343224"
      },
      {
        "className": "4. RB",
        "classId": "343229"
      }
    ])
  });

});
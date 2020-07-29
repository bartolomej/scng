const $ = require('cheerio');

/**
 * Parses classes from <select> element
 * on easistent.com schedule page
 */
function parseClasses (html) {
  let parsedClasses = [];
  let selectionBox = $('#id_parameter', html);
  $('option', selectionBox).each((i, ele) => {
    parsedClasses.push({
      name: $(ele).text(),
      id: $(ele).attr('value')
    })
  });
  return parsedClasses;
}

function parseScheduleTable (html) {
  let parsedRows = [];
  $('tr', html).each((i, ele) => {
    let row = [];
    if (i === 1) {
      row = parseScheduleTopRow(ele);
    } else {
      row = parseScheduleRow(ele);
    }
    if (row.length !== 0) {
      parsedRows.push(row);
    }
  });
  return parsedRows;
}

/**
 * Parses <th> elements with
 * day of the week and date values
 */
function parseScheduleTopRow (trNode) {
  return $('th', trNode).map((i, ele) => {
    if (i === 0) return null;
    else return {
      day: $(ele.children[1]).text(),
      date: $(ele.children[3]).text()
    };
  }).get();
}

/**
 * Parses single table body box
 * used for lessons
 */
function parseScheduleRow (trNode) {
  let tableRow = [];
  $('td.ednevnik-seznam_ur_teden-td', trNode).each((i, ele) => {
    if (i === 0) {
      tableRow.push(parseTimeTableData(ele));
    } else {
      tableRow.push(parseLessonTableData(ele));
    }
  });
  return tableRow;
}

/**
 * Parses corner table boxes with
 * lesson time information
 */
function parseTimeTableData (node) {
  return {
    index: $($(node)[0].children[1]).text(),
    period: $($(node)[0].children[3]).text()
  }
}

/**
 * Parses main box with details
 * about lesson
 */
function parseLessonTableData (node) {
  const groups = $('.ednevnik-seznam_ur_teden-urnik', node);
  return groups.map((i, ele) => {
    if ($('span', ele).length !== 0) {
      const details = $('.text11', ele).text()
        .replace(/[\t\n]/g, '')
        .split(', ');
      const group = details[1].split(' Skupina ')[1];
      const classRoom = details[1].split(' Skupina ')[0];
      return {
        type: 'normal',
        fullName: formatText($('span', ele).attr('title')),
        shortName: formatText($('span', ele).text()),
        teacher: formatText(details[0]),
        group: group === undefined ? '' : formatText(group),
        classRoom: formatText(classRoom),
      }
    } else {
      return {
        type: 'other',
        fullName: $($(ele)[0].children).text().replace(/[\t\n]/g, ''),
        shortName: '',
        teacher: '',
        group: '',
        classRoom: '',
      }
    }
  }).get();
}

function formatText (text) {
  return text
    .replace(/\n/g, ' ')
    .replace(/\t/g, '')
    .replace(/^\s+|\s+$|\s+(?=\s)/g, '');
}

module.exports = {
  parseClasses,
  parseScheduleTable
};

module.exports.test = {
  parseClasses,
  parseScheduleTable,
  parseScheduleTopRow,
  parseScheduleRow,
  parseLessonTableData,
  parseTimeTableData
};

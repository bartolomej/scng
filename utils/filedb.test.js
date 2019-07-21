const fileDb = require('./filedb');
const path = require('path');
const fs = require('fs').promises;


describe('File db tests', function () {

  it('should write / read file', async function () {
    await fileDb.write(path.join(__dirname, 'test.txt'), {key: 'value'});

    let file = await fileDb.read(path.join(__dirname, 'test.txt'));
    await fileDb.remove(path.join(__dirname, 'test.txt'));

    expect(file).toEqual({key: 'value'});
  });

  it('should retrieve all files in directory', async function () {
    await fs.mkdir(path.join(__dirname, 'test'));
    await fileDb.write(path.join(__dirname, 'test', 'test1.json'), {key: 'value1'});
    await fileDb.write(path.join(__dirname, 'test', 'test2.json'), {key: 'value2'});

    let files = await fileDb.readAll(path.join(__dirname, 'test'));
    await fileDb.remove(path.join(__dirname, 'test'));

    expect(files).toEqual([
      {key: 'value1'},
      {key: 'value2'}
    ]);
  });

});
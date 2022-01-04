const test = require('tape');
const fs = require('fs');
const parse = require('..');

test('should parse kmz', function (t) {
  const stream = fs.createReadStream(`${__dirname}/fixtures/usa.kmz`);
  parse(stream, (err, trip) => {
    const expected = require('./fixtures/usa.json');

    t.error(err);
    t.deepEqual(trip, expected);
    t.end();
  });
});

test('should raise error on a file that contains invalid KML', function (t) {
  const stream = fs.createReadStream(`${__dirname}/fixtures/invalid-kml-inside.kmz`);
  parse(stream, (err, trip) => {
    t.notLooseEqual(err, null, 'error should exists');
    t.equal(err.err, 'invalid');
    t.equal(err.message, 'Unexpected close tag');
    t.looseEqual(trip, null, 'trip should not exist');
    t.end();
  });
});

test('should raise error on a file that does not contain KML', function (t) {
  const stream = fs.createReadStream(`${__dirname}/fixtures/no-kml-inside.kmz`);
  parse(stream, (err, trip) => {
    t.notLooseEqual(err, null, 'error should exists');
    t.equal(err, 'invalid');
    t.looseEqual(trip, null, 'trip should not exist');
    t.end();
  });
});

test('should raise error on a file that cannot be unzipped', function (t) {
  const stream = fs.createReadStream(`${__dirname}/fixtures/not-a-zip.kmz`);
  parse(stream, (err, trip) => {
    t.notLooseEqual(err, null, 'error should exists');
    t.equal(err.err, 'invalid');
    t.ok('message' in err, 'should have property message');
    t.looseEqual(trip, null, 'trip should not exist');
    t.end();
  });
});

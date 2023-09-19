const test = require('node:test');
const assert = require('node:assert/strict');

const fs = require('fs');
const parse = require('..');

test('should parse kmz', function (t, done) {
  const stream = fs.createReadStream(`${__dirname}/fixtures/usa.kmz`);
  parse(stream, (err, trip) => {
    const expected = require('./fixtures/usa.json');

    assert.ifError(err);
    assert.deepEqual(trip, expected);
    done();
  });
});

test('should raise error on a file that contains invalid KML', function (t, done) {
  const stream = fs.createReadStream(`${__dirname}/fixtures/invalid-kml-inside.kmz`);
  parse(stream, (err, trip) => {
    assert.ok(err, 'error should exists');
    assert.equal(err.err, 'invalid');
    assert.equal(err.message, 'Unexpected close tag');
    assert.ok(!trip, 'trip should not exist');
    done();
  });
});

test('should raise error on a file that does not contain KML', function (t, done) {
  const stream = fs.createReadStream(`${__dirname}/fixtures/no-kml-inside.kmz`);
  parse(stream, (err, trip) => {
    assert.ok(err, 'error should exists');
    assert.equal(err, 'invalid');
    assert.ok(!trip, 'trip should not exist');
    done();
  });
});

test('should raise error on a file that cannot be unzipped', function (t, done) {
  const stream = fs.createReadStream(`${__dirname}/fixtures/not-a-zip.kmz`);
  parse(stream, (err, trip) => {
    assert.ok(err, 'error should exists');
    assert.equal(err.err, 'invalid');
    assert.ok('message' in err, 'should have property message');
    assert.ok(!trip, 'trip should not exist');
    done();
  });
});

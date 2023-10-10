const test = require('node:test');
const assert = require('node:assert/strict');

const fs = require('node:fs');
const path = require('node:path');

require('./deflate-raw');

const parse = require('..');

function openAsBlob(name) {
  const filename = path.join(__dirname, name);
  return fs.openAsBlob(filename);
}

test('should parse kmz', async function () {
  const blob = await openAsBlob('/fixtures/usa.kmz');
  const trip = await parse(blob);
  const expected = require('./fixtures/usa.json');
  assert.deepEqual(trip, expected);
});

test('should parse deflated kmz', async function () {
  const blob = await openAsBlob('/fixtures/usa.deflated.kmz');
  const trip = await parse(blob);
  const expected = require('./fixtures/usa.json');
  assert.deepEqual(trip, expected);
});

test('should raise error on a file that contains invalid KML', async function () {
  const stream = await openAsBlob('/fixtures/invalid-kml-inside.kmz');
  await assert.rejects(parse(stream), /Unclosed tag/i);
});

test('should raise error on a file that does not contain KML', async function () {
  const stream = await openAsBlob('/fixtures/no-kml-inside.kmz');
  await assert.rejects(parse(stream), /no KML file found/i);
});

test('should raise error on a file that cannot be unzipped', async function () {
  const stream = await openAsBlob('/fixtures/not-a-zip.kmz');
  await assert.rejects(parse(stream), /invalid signature/i);
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

import parse from '../lib/import.js';

function openAsBlob(name) {
  const filename = path.resolve(import.meta.dirname, name);
  return fs.openAsBlob(filename);
}

function readJSON(name) {
  const filename = path.resolve(import.meta.dirname, name);
  return JSON.parse(fs.readFileSync(filename, 'utf8'));
}

test('should parse kmz', async function () {
  const blob = await openAsBlob('./fixtures/usa.kmz');
  const trip = await parse(blob);
  const expected = readJSON('./fixtures/usa.json');
  assert.deepEqual(trip, expected);
});

test('should raise error on a file that contains invalid KML', async function () {
  const stream = await openAsBlob('./fixtures/invalid-kml-inside.kmz');
  await assert.rejects(parse(stream), /Unclosed tag/i);
});

test('should raise error on a file that does not contain KML', async function () {
  const stream = await openAsBlob('./fixtures/no-kml-inside.kmz');
  await assert.rejects(parse(stream), /no KML file found/i);
});

test('should raise error on a file that cannot be unzipped', async function () {
  const stream = await openAsBlob('./fixtures/not-a-zip.kmz');
  await assert.rejects(parse(stream), /invalid signature/i);
});

const parse = require('@furkot/import-kml');

const { findKml } = require('./kmz');

/* global TextDecoderStream   */

module.exports = parseKmz;
parseKmz.wantsBlob = true;

/**
 * Parses
 * @param {Blob} blob
 */
async function parseKmz(blob) {
  const kml = await findKml(blob);
  const stream = kml.pipeThrough(new TextDecoderStream());
  return parse(stream);
}

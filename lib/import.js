import parse from '@furkot/import-kml';
import { findKml } from './kmz.js';

parseKmz.wantsBlob = true;

/**
 * Parses
 * @param {Blob} blob
 */
export default async function parseKmz(blob) {
  const kml = await findKml(blob);
  const stream = kml.pipeThrough(new TextDecoderStream());
  return parse(stream);
}

const debug = require('debug')('furkot-import-kmz');

/* global DecompressionStream, TextDecoder  */

module.exports = {
  findKml
};

/**
 * Parse ZIP file, find Blob coresponding to first KML file
 * @param {Blob} blob
 * @returns ReadableStream on a found KML
 */
async function findKml(blob) {
  const eocd = await endOfCentralDirectory(blob);
  const cd = await centralDirectory(blob, eocd);
  return cd.findKml();
}

const EOCD_LEN = 22;

async function endOfCentralDirectory(blob) {
  const ab = await blob.slice(-EOCD_LEN).arrayBuffer();
  const dv = new DataView(ab);
  signatureCheck(dv, 0x06054b50, 'EOCD');

  return {
    get cdCount() { return dv.getUint16(8, true); },
    get cdStart() { return dv.getUint32(16, true); },
    get cdLen() { return dv.getUint32(12, true); }
  };
}

const CENTRAL_DIRECTORY_FILE_HEADER_LEN = 46;
const KML_REGEXP = /\.kml$/i;

async function centralDirectory(blob, { cdStart, cdLen, cdCount }) {
  const dv = await dataViewSlice(blob, cdStart, cdLen);
  signatureCheck(dv, 0x02014b50, 'Central Directory');
  const decoder = new TextDecoder();

  return {
    findKml
  };

  async function findKml() {
    for (
      let entry = entryAt(0), i = 0;
      i < cdCount;
      entry = entry.next(), i++
    ) {
      if (KML_REGEXP.test(entry.name())) {
        const lfh = await localFileHeader(blob, entry.localFileOffset());
        return lfh.stream();
      }
    }
    throw new Error('no KML file found');
  }

  function entryAt(index) {
    return {
      name,
      localFileOffset,
      next
    };

    function uint16(offset) {
      return dv.getUint16(index + offset, true);
    }

    function uint32(offset) {
      return dv.getUint32(index + offset, true);
    }

    function nameLen() {
      return uint16(28);
    }

    function name() {
      const start = index + CENTRAL_DIRECTORY_FILE_HEADER_LEN;
      const len = nameLen();
      return decoder.decode(dv.buffer.slice(start, start + len));
    }

    function size() {
      return CENTRAL_DIRECTORY_FILE_HEADER_LEN +
        nameLen() +
        uint16(30) + // extra field len
        uint16(32);  // comment len
    }

    function next() {
      return entryAt(index + size());
    }

    function localFileOffset() {
      return uint32(42);
    }
  }
}
exports.centralDirectory = centralDirectory;
const LOCAL_FILE_HEADER_LEN = 30;

async function localFileHeader(blob, lfStart) {
  const dv = await dataViewSlice(blob, lfStart, LOCAL_FILE_HEADER_LEN);
  signatureCheck(dv, 0x04034b50, 'Local File Header');
  const compressedSize = uint32(18);
  const compression = uint16(8);
  const fileStart = lfStart + size();

  return {
    stream
  };

  function uint16(offset) {
    return dv.getUint16(offset, true);
  }

  function uint32(offset) {
    return dv.getUint32(offset, true);
  }

  function size() {
    return LOCAL_FILE_HEADER_LEN +
      uint16(26) + // file name len
      uint16(28); // extra field len
  }

  function stream() {
    const s = blob.slice(fileStart, fileStart + compressedSize).stream();
    if (compression === 0) {
      return s;
    } else if (compression === 8) {
      return s.pipeThrough(new DecompressionStream('deflate-raw'));
    } else {
      throw new Error(`Unsupported compression method: ${compression}`);
    }
  }
}

/**
 * Check if proper signature is found at the beginning of the buffer
 * @param {DataView} dv data view
 * @param {Number} expected signature
 * @param {String} type used in error message
 */
function signatureCheck(dv, expected, type) {
  const signature = dv.getUint32(0, true);
  if (signature !== expected) {
    debug('Found signature %s - expected %s', signature.toString(16), expected.toString(16));
    throw new Error(`Invalid signature for ${type}`);
  }
}

async function dataViewSlice(blob, from, len) {
  const ab = await blob.slice(from, from + len).arrayBuffer();
  return new DataView(ab);
}

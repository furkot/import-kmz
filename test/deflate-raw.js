if (check()) {
  polyfill();
}

/* global DecompressionStream */
function check() {
  try {
    new DecompressionStream('deflate-raw');
    return false;
  } catch {
    // polyfill needed
    return true;
  }
}

function polyfill() {
  const { createInflateRaw } = require('node:zlib');
  const { Duplex } = require('node:stream');

  class PolyfilledStream extends DecompressionStream {
    constructor(format) {
      if (format === 'deflate-raw') {
        return Duplex.toWeb(createInflateRaw());
      }
      super(format);
    }
  }

  globalThis.DecompressionStream = PolyfilledStream;

}

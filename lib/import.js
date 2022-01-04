const unzip = require('unzipper');
const parse = require('furkot-import-kml');
const debug = require('debug')('furkot-import-kmz');

module.exports = parseKmz;

function parseKmz(file, fn) {
  let done;

  file
    .pipe(unzip.Parse())
    .on('entry', entry => {
      debug('%s %s entry found', entry.type, entry.path);
      if (!done && entry.type === 'File' && entry.path.includes('.kml')) {
        done = true;
        return parse(entry, fn);
      }
      entry.autodrain();
    })
    .on('finish', () => {
      debug('finish fired');
      if (!done) {
        fn('invalid');
      }
    })
    .on('error', err => {
      debug('error fired', err);
      if (!done) {
        fn({
          err: 'invalid',
          message: err.message
        });
      }
    });
}

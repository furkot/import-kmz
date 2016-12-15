var unzip = require('unzipper');
var parse = require('furkot-import-kml');
var debug = require('debug')('furkot-import-kmz');

module.exports = parseKmz;

function parseKmz(file, fn) {
  var done, finishTimeout;

  file
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      debug('%s %s entry found', entry.type, entry.path);
      if (!done && entry.type === 'File' && entry.path.indexOf('.kml') !== -1) {
        done = true;
        clearTimeout(finishTimeout);
        return parse(entry, fn);
      }
      entry.autodrain();
    })
    .on('finish', function() {
      debug('finish fired');
      if (done) {
        return;
      }
      // HACK - finish might be sent before all the entries are sent
      finishTimeout = setTimeout(function() {
        if (!done) {
          fn('invalid');
        }
      }, 300);
    })
    .on('error', function(err) {
      debug('error fired', err);
      if (!done) {
        fn(err);
      }
    });
}

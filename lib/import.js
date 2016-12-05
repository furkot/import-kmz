var unzip = require('@aredridel/unzip');
var parse = require('furkot-import-kml');

module.exports = parseKmz;

function parseKmz(file, fn) {
  var done;
  file
    .pipe(unzip.Parse())
    .on('entry', function (entry) {
      try {
        if (entry.type === 'File' && entry.path.indexOf('.kml') !== -1) {
          done = true;
          return parse(entry, fn);
        }
        entry.autodrain();
      } catch (e) {
        done = true;
        fn('invalid');
      }
    })
    .on('close', function () {
      if (!done) {
        fn('invalid');
      }
    })
    .on('error', fn);
}

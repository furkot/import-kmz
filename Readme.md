[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Dependency Status][gemnasium-image]][gemnasium-url]

# furkot-import-kmz

Import [KMZ] files into [Furkot] road trip planner.

## Install

```sh
$ npm install --save furkot-import-kmz
```

## Usage

Use as a transform stream: pipe network responses, files etc. and listen on `data` event.

```js
var furkotImportKmz = require('furkot-import-kmz');
var request = require('getlet');

request('https://example.com/my.kmz')
  .pipe(furkotImportKmz)
  .on('data', function(trip) {
    console.log(trip);
  });
```

## License

MIT © [Damian Krzeminski](https://code42day.com)

[Furkot]: https://furkot.com
[KMZ]: https://developers.google.com/kml

[npm-image]: https://img.shields.io/npm/v/furkot-import-kmz.svg
[npm-url]: https://npmjs.org/package/furkot-import-kmz

[travis-url]: https://travis-ci.org/furkot/import-kmz
[travis-image]: https://img.shields.io/travis/furkot/import-kmz.svg

[gemnasium-image]: https://img.shields.io/gemnasium/furkot/import-kmz.svg
[gemnasium-url]: https://gemnasium.com/furkot/import-kmz

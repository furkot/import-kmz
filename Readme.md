[![NPM version][npm-image]][npm-url]
[![Build Status][build-image]][build-url]
[![Dependency Status][deps-image]][deps-url]

# @furkot/import-kmz

Import [KMZ] files into [Furkot] road trip planner.

## Install

```sh
$ npm install --save @furkot/import-kmz
```

## Usage

Use with a blob created from `File` or `fetch` response.

```js
const importKmz = require('@furkot/import-kmz');

const response = fetch('https://example.com/my.kmz');
const blob = await response.blob();
const trip = await importKmz(blob);
```

## License

MIT © [Damian Krzeminski](https://code42day.com)

[Furkot]: https://furkot.com
[KMZ]: https://developers.google.com/kml

[npm-image]: https://img.shields.io/npm/v/@furkot/import-kmz
[npm-url]: https://npmjs.org/package/@furkot/import-kmz

[build-url]: https://github.com/furkot/import-kmz/actions/workflows/check.yaml
[build-image]: https://img.shields.io/github/actions/workflow/status/furkot/import-kmz/check.yaml?branch=main

[deps-image]: https://img.shields.io/librariesio/release/npm/@furkot/import-kmz
[deps-url]: https://libraries.io/npm/@furkot%2Fimport-kmz

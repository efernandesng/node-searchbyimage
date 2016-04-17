searchbyimage
=============

Guess the image content using Google search.

[![npm version](https://badge.fury.io/js/searchbyimage.svg)](https://www.npmjs.com/package/searchbyimage)
[![Build Status](https://travis-ci.org/efernandesng/node-searchbyimage.svg?branch=master)](https://travis-ci.org/efernandesng/node-searchbyimage)

## Installation

```bash
$ npm install searchbyimage
```

## Example

```javascript
const searchByImage = require('searchbyimage');

const image = 'https://pixabay.com/static/uploads/photo/2014/11/07/21/39/oporto-521258_640.jpg';

// Using callback
searchByImage(image, (err, res)=> {
  console.log(res); // {guess: 'night'}
})

// or promise
searchByImage(image).then((res)=> {
  console.log(res); // {guess: 'night'}
})

```

## Options

- `userAgent` - The `user-agent` string used in request.
- `language` - Google result language ([supported langs](https://developers.google.com/custom-search/docs/ref_languages)) 
(default: `'en'`)

## Documentation

#### searchByImage ( localImageFile, [options,] [callback] ) -> Promise

#### searchByImage ( imageUrl, [options,] [callback] ) -> Promise

## Tests

To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## License
[MIT](https://github.com/efernandesng/node-searchbyimage/blob/master/LICENSE.md)

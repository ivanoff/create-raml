
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![js-standard-style][standard-style-image]][standard-style-url]
[![Build Status: Linux][travis-image]][travis-url]
[![Build Status: Windows][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]


# create-raml

### Create RAML from object

 v1.1.1


## Installation
```npm i -S create-raml```


## Usage

```javascript
var Raml = require('../index');
var raml = new Raml({
  title: 'Testing',
  baseUri: 'http://localhost:3000',
  version: 'v1',
});

raml.type('books', {
  name: { type: 'string', required: true },
  numberOfPages: { type: 'integer' },
});

raml.methods('books', 'get', {
  description: 'Get information about all books',
  responses: {
    200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
    404: { 'application/json': { code: '120', message: 'Books not found' } },
  },
});

raml.generate(function (err, ramlText) {
  console.log(ramlText);
});
```


## Result

```
#%RAML 1.0
title: Testing
baseUri: http://localhost:3000
version: 

types:
  books: |
     {
       "name": {
         "type": "string",
         "required": true
       },
       "numberOfPages": {
         "type": "integer"
       }
     }

/books:
  get:
    description: Get information about all books
    responses:
      200:
        body:
          application/json:
            example: |
             [
               {
                 "name": "one",
                 "author": {
                   "name": "Art"
                 }
               }
             ]
      404:
        body:
          application/json:
            example: |
             {
               "code": "120",
               "message": "Books not found"
             }
```

## Tests

```npm test```


## Created by

Dimitry, 2@ivanoff.org.ua

```curl -A cv ivanoff.org.ua```


[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[standard-style-image]: https://img.shields.io/badge/code%20style-airbnb-blue.svg?style=flat
[standard-style-url]: https://github.com/airbnb/javascript

[npm-url]: https://npmjs.org/package/create-raml
[npm-version-image]: http://img.shields.io/npm/v/create-raml.svg?style=flat
[npm-downloads-image]: http://img.shields.io/npm/dm/create-raml.svg?style=flat

[travis-url]: https://travis-ci.org/ivanoff/create-raml
[travis-image]: https://travis-ci.org/ivanoff/create-raml.svg?branch=master

[appveyor-url]: https://ci.appveyor.com/project/ivanoff/create-raml/branch/master
[appveyor-image]: https://ci.appveyor.com/api/projects/status/lp3nhnam1eyyqh33/branch/master?svg=true

[coveralls-url]: https://coveralls.io/github/ivanoff/create-raml
[coveralls-image]: https://coveralls.io/repos/github/ivanoff/create-raml/badge.svg

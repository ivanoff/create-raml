
[![NPM version][npm-version-image]][npm-url]
[![NPM downloads][npm-downloads-image]][npm-url]
[![MIT License][license-image]][license-url]
[![js-standard-style][standard-style-image]][standard-style-url]
[![Build Status: Linux][travis-image]][travis-url]
[![Build Status: Windows][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]


# create-raml

### Create RAML from object or Express.js application

 v3.2.3


## Installation
```npm i -S create-raml```


## Create RAML based on Express.js

### Simple express example

```javascript
var express = require('express');
var Raml = require('create-raml');

var app = express();

var raml = new Raml({ express: app });

// regular app express workflow ( app.get, app.post, app.listen... etc )
```

### Get created raml

```curl 127.0.0.1:3000/api.raml```


### Extended express example

- [extended Express API example](docs/express_movies_api.md) - movies database API example ( GET, POST, DELETE methods; RAM data storage ). Result example as html: [Movies Database API documentation](http://create-raml.simpleness.org/express_movies_api.html)

### Simple example

```javascript
var express = require('express');
var Raml = require('create-raml');

var app = express();
var raml = new Raml({ express: app });

app.get('/movies', function (req, res) { res.send('List of all movies'); });
app.post('/movies', function (req, res) { res.send('Add new movie'); });
app.get('/movies/:id', function (req, res) { res.send('Get movie by id'); });
app.delete('/movies/:id', function (req, res) { res.send('Delete movie by id'); });

app.listen(3000, function () { console.log('Example app listening on port 3000!'); });
```

```curl 127.0.0.1:3000/api.raml```

### Result

```
#%RAML 1.0
title: 
version: 

types:

/api.raml:
  get:
    description: get /api.raml

/movies:
  get:
    description: get /movies
  post:
    description: post /movies
    
  /{id}:
    get:
      description: get /movies/:id
    delete:
      description: delete /movies/:id
```

## Create RAML from object

```javascript
var Raml = require('create-raml');
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


### Result

```
#%RAML 1.0
title: Testing
baseUri: http://localhost:3000
version: v1

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

## Options parameters

```javascript
var raml = new Raml(options);
```

 - **version** - version of RAML ( default: 1.0 )
 - **express** - an Express application
 - **path** - path to get API RAML ( default: /api.raml )
 - **storeResponses** - store first response as example ( default: false )
 - **guessAll** - make description quite pretty ( default: false )
 - **title** - title of API in document
 - **baseUri** - URI of API in document
 - **versionAPI** - version of API in document
 - **templateFileName** - path to template


## Tests

```npm test```


## Change Log

[all changes](CHANGELOG.md)


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

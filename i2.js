'use strict';
var fs = require('fs');

var Raml = require('./index');
var raml = new Raml({
  title: 'Testing',
  baseUri: 'http://localhost:3000',
  version: 'v1',
});

raml.type('books', {
  name: { type: 'string', required: true },
  numberOfPages: { type: 'integer' },
  author: {
    name: { type: 'string' },
    email: { type: 'email' },
  },
});

raml.methods('books', 'get', {
  description: 'Get information about all books',
  responses: {
    200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
    404: { 'application/json': { code: '120', message: 'Books not found' } },
  },
});

raml.methods('books', 'post', {
  description: 'Add new book',
  body: {
      'application/json': {
          type: 'books',
          example: { name: 'one', author: { name: 'Art' } },
        },
    },
  responses: {
    201: { 'application/json': { name: 'one', author: { name: 'Art' } } },
    400: { 'application/json': { code: '221', message: 'name not matched with string type' } },
  },
});

raml.methods('books/:bookId/readers', {
  get: {
    description: 'Get information about who has read {bookId} book',
    responses: {
      200: { 'application/json': [{ _id: 343, name: 'Mike' },{ _id: 324, name: 'John'}] },
      404: { 'application/json': { code: '121', message: 'Readers not found' } },
    },
  },
});

raml.methods('books/:bookId', {
  get: {
    description: 'Get information about {bookId} book',
    responses: {
      200: { 'application/json': { _id: 123, name: 'one', author: { name: 'Art' } } },
      404: { 'application/json': { code: '121', message: 'Book not found' } },
    },
  },
  delete: {
    description: 'Delete {bookId} book',
    responses: {
      200: { 'application/json': { ok: 1, _id: 123 } },
      400: { 'application/json': { code: '221', message: 'name not matched with string type' } },
      404: { 'application/json': { code: '121', message: 'Book not found' } },
    },
  },
});

raml.generate(function (err, ramlText) {

  console.log(ramlText);

  fs.writeFile('test-raml2html.raml', ramlText, function (err) {
    console.log('===== raml2html parsing =====');
    var raml2html = require('raml2html');
    var configWithDefaultTheme = raml2html.getConfigForTheme();
    raml2html.render('test-raml2html.raml', configWithDefaultTheme).then(function (result) {
      console.log('test-raml2html passed');
    }, function (error) {

      console.log('Error raml2html parsing: ' + error);
    });
  });

});

//var raml2 = new Raml();
//console.log(raml2.generate());

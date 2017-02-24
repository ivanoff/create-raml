'use strict';

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
          schema: 'books',
          example: { name: 'one', author: { name: 'Art' } },
        },
    },
  responses: {
    201: { 'application/json': { name: 'one', author: { name: 'Art' } } },
    400: { 'application/json': { code: '221', message: 'name not matched with string type' } },
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

var ramlText = raml.generate();
console.log(ramlText);

//var raml2 = new Raml();
//console.log(raml2.generate());

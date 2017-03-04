'use strict';

var should = require('chai').should();
var fs = require('fs');
var raml2html = require('raml2html');

var Raml = require('../');
var testFileName = 'test-raml2html.raml';

function checkRaml(raml, done) {
  raml.generate(function (err, ramlText) {
    fs.writeFile(testFileName, ramlText, function (err) {
      var configWithDefaultTheme = raml2html.getConfigForTheme();
      raml2html.render(testFileName, configWithDefaultTheme).then(function (result) {
        done();
      }, function (error) {

        done(error);
      });
    });
  });
}

describe.skip('testing with raml2html', function () {

    describe('Simple RAML', function () {

        beforeEach(function () {
          this.raml = new Raml({
            title: 'Testing',
            baseUri: 'http://localhost:3000',
            versionAPI: 'v1',
          });
        });

        afterEach(function () {
          fs.unlinkSync(testFileName);
          this.raml = null;
        });

        it('empty RAML', function (done) {
          checkRaml(this.raml, done);
        });

        it('raml with type only', function (done) {
          this.raml.type('books', {
            name: { type: 'string', required: true },
            numberOfPages: { type: 'integer' },
            author: {
              name: { type: 'string' },
              email: { type: 'email' },
            },
          });
          checkRaml(this.raml, done);
        });

        it('raml with type and schema', function (done) {
          this.raml.type('books', {
            name: { type: 'string', required: true },
            numberOfPages: { type: 'integer' },
            author: {
              name: { type: 'string' },
              email: { type: 'email' },
            },
          });

          this.raml.methods('books', 'get', {
            description: 'Get information about all books',
            responses: {
              200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
              404: { 'application/json': { code: '120', message: 'Books not found' } },
            },
          });

          checkRaml(this.raml, done);
        });

        it('raml with type and schema', function (done) {
          this.raml.type('books', {
            name: { type: 'string', required: true },
            numberOfPages: { type: 'integer' },
            author: {
              name: { type: 'string' },
              email: { type: 'email' },
            },
          });

          this.raml.methods('books/:id', 'delete', {
            description: 'Delete {bookId} book',
            responses: {
              200: { 'application/json': { ok: 1, _id: 123 } },
              404: { 'application/json': { code: '121', message: 'Book not found' } },
            },
          });

          this.raml.methods('books', {
            get: {
              description: 'Get information about all books',
              responses: {
                200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
                404: { 'application/json': { code: '120', message: 'Books not found' } },
              },
            },
            post: {
                description: 'Add new book',
                body: {
                    'application/json': {
                        type: 'books',
                        example: { name: 'one', author: { name: 'Art' } },
                      },
                  },
                responses: {
                  201: { 'application/json': { name: 'one', author: { name: 'Art' } } },
                  400: { 'application/json': { code: '221', message: 'name is not string type' } },
                },
              },
          });

          checkRaml(this.raml, done);
        });

      });

    describe('errors', function () {

        beforeEach(function () {
          this.raml = new Raml({ templateFileName: 'template/noFile' });
        });

        afterEach(function () {
          this.raml = null;
        });

        it('file not exists testing', function (done) {
          this.raml.generate(function (err, ramlText) {
            (err instanceof Error).should.equal(true);
            String(err).should.match(/ENOENT: no such file/);
            done();
          });
        });

      });

  });


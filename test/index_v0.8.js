'use strict';
var should = require('chai').should();
var Raml = require('../');

describe('testing v0.8 with no validators', function () {

    describe('check if text is in generated raml', function () {

        beforeEach(function () {
          this.raml = new Raml({
            version: 0.8,
            title: 'Testing',
            baseUri: 'http://localhost:3000',
            versionAPI: 'v1',
          });
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
        });

        afterEach(function () {
          this.raml = null;
        });

        it('check generated file', function (done) {
          this.raml.generate(function (err, ramlText) {
            (err instanceof Error).should.equal(false);
            ramlText.should.match(/#%RAML 0.8/);
            ramlText.should.match(/title: Testing/);
            ramlText.should.match(/baseUri: http:\/\/localhost:3000/);
            ramlText.should.match(/version: v1/);
            ramlText.should.match(/schemas:/);
            ramlText.should.match(/\/books/);
            ramlText.should.match(/numberOfPages/);
            ramlText.should.match(/Get information about all books/);
            ramlText.should.match(/200/);
            ramlText.should.match(/Books not found/);
            done();
          });
        });
      });

    describe('type and methods getters', function () {

        beforeEach(function () {
          this.raml = new Raml();
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
        });

        afterEach(function () {
          this.raml = null;
        });

        it('type testing', function (done) {
          this.raml.type().should.eql({
            books: {
              name: { type: 'string', required: true },
              numberOfPages: { type: 'integer' },
              author: { name: { type: 'string' }, email: { type: 'email' } },
            },
          });

          this.raml.type('books').should.eql({
            name: { type: 'string', required: true },
            numberOfPages: { type: 'integer' },
            author: { name: { type: 'string' }, email: { type: 'email' } },
          });

          done();
        });

        it('methods testing', function (done) {
          this.raml.methods().should.eql({
            books: {
              get: {
                description: 'Get information about all books',
                responses: {
                  200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
                  404: { 'application/json': { code: '120', message: 'Books not found' } },
                },
              },
            },
          });

          this.raml.methods('books').should.eql({
            get: {
              description: 'Get information about all books',
              responses: {
                200: { 'application/json': [{ name: 'one', author: { name: 'Art' } }] },
                404: { 'application/json': { code: '120', message: 'Books not found' } },
              },
            },
          });

          done();
        });

      });

  });


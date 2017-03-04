'use strict';
var should = require('chai').should();
var express = require('express');
var httpMocks = require('node-mocks-http');
var Raml = require('../');

describe('testing express', function () {

  describe('check generated raml', function () {
    var app = { _router: { stack: [
      undefined,
      { },
      { route: { path: 'no_methods' } },
      { route: { methods: 'not_object' } },
      { route: { methods: { no_path: true } } },
      { route: { path: '/aaa', methods: { get: true } } },
      { route: { path: '/aaa', methods: { post: true } } },
      { route: { path: '/aaa/:idAaa', methods: { get: true } } },
      { route: { path: '/bbb', methods: { get: true } } },
    ], }, };
    app.use = function() {};

    beforeEach(function () {
      this.raml = new Raml({ express: app });
    });

    afterEach(function () {
      this.raml = null;
    });

    it('app is undefined', function (done) {
      this.raml.express({}, { send: function (data) {
          data.should.match(/^\/aaa:/m);
          data.should.match(/^\/bbb:/m);
          data.should.match(/\s\/{idAaa}:(.|\s)+\/bbb/);
          done();
        }, });
    });
  });

  [undefined, { _router: undefined }, { _router: { stack: undefined } }].forEach(function (app) {
    describe('check various empties app', function () {
      beforeEach(function () {
        if(app) app.use = function() {};
        this.raml = new Raml({ express: app });
      });

      afterEach(function () {
        this.raml = null;
      });

      it('app is undefined', function (done) {
        this.raml.express({}, { send: function (data) {
            data.should.match(/^#%RAML 1.0/m);
            data.should.match(/^title:/m);
            data.should.match(/^version:/m);
            (data.split('\n').length <= 6).should.equal(true);
            done();
          }, });
      });
    });
  });

  describe('express workflow', function () {

    beforeEach(function () {
      this.app = express()
      this.app.get('/b', function (req, res) { res.send('b1:') });
      this.app.post('/b', function (req, res) { res.send('b2:') });
      this.app.get('/b/:id', function (req, res) { res.send('b3:' + req.params.id) });
      this.app.delete('/b/:id', function (req, res) { res.send('b4:' + req.params.id) });

      this.raml = new Raml({express: this.app, storeResponses: true, guessAll: true});
      this.app.get('/api.raml', this.raml.express.bind(this.raml));
    });

    afterEach(function () {
      this.raml = null;
      this.app = null;
    });

    it('typical usage', function (done) {
      this.raml.express({}, { send: function (data) {
          data.should.match(/^\/b:/m);
          data.should.match(/^\s+\/{id}:/m);
          done();
        }, });
    });
  });

});

describe('with httpMocks', function () {

    var app = { _router: { stack: [
      { route: { path: '/aaa', methods: { get: true } } },
      { route: { path: '/aaa', methods: { post: true } } },
      { route: { path: '/aaa/:id', methods: { get: true } } },
    ], }, };
    app.use = function() {};

    var raml = new Raml({ express: app });
    var request = {};
    var response = {};

    beforeEach(function(done) {
      response = httpMocks.createResponse({
        eventEmitter: require('events').EventEmitter
      });
      done();
    });

    it('post /aaa', function (done) {

      request = httpMocks.createRequest({
        method: 'POST',
        url: '/aaa',
        query: {
          name: 'foo'
        },
        route: {
          path: '/aaa',
          stack: [{
            method: 'post',
          }]
        }
      });

      response.on('end', function () {
        // console.log(response._getData());
        response.status(400);
        done();
      });

      var _this = this;
      raml.storeResponses(request, response, function next(error) {
        raml.express(request, response, function next(error) {
        });
      });
    });

    it('post /aaa again', function (done) {

      request = httpMocks.createRequest({
        method: 'POST',
        url: '/aaa',
        query: {
          name: 'foo'
        },
        route: {
          path: '/aaa',
          stack: [{
            method: 'post',
          }]
        }
      });

      response.on('end', function () {
        // console.log(response._getData());
        response.status(400);
        done();
      });

      var _this = this;
      raml.storeResponses(request, response, function next(error) {
        raml.express(request, response, function next(error) {
        });
      });
    });

    it('delete /aaa/123', function (done) {

      request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/aaa/123',
        query: {
          name: 'foo'
        },
        route: {
          path: '/aaa/123',
          stack: [{
            method: 'delete',
          }]
        }
      });

      response.on('end', function () {
        // console.log(response._getData());
        response.status(400);
        done();
      });

      var _this = this;
      raml.storeResponses(request, response, function next(error) {
        raml.express(request, response, function next(error) {
        });
      });
    });

    it('delete /aaa/123 again', function (done) {

      request = httpMocks.createRequest({
        method: 'DELETE',
        url: '/aaa/123',
        query: {
          name: 'foo'
        },
        route: {
          path: '/aaa/123',
          stack: [{
            method: 'delete',
          }]
        }
      });

      response.on('end', function () {
        // console.log(response._getData());
        response.status(400);
        done();
      });

      var _this = this;
      raml.storeResponses(request, response, function next(error) {
        raml.express(request, response, function next(error) {
        });
      });
    });

    it('post /xxx', function (done) {

      request = httpMocks.createRequest({
        method: 'POST',
        url: '/xxx',
        query: {
          name: 'foo'
        },
        route: {
          path: '/xxx',
          stack: [{
            method: 'post',
          }]
        }
      });

      response.on('end', function () {
        // console.log(response._getData());
        response.status(400);
        done();
      });

      var _this = this;
      raml.storeResponses(request, response, function next(error) {
        raml.express(request, response, function next(error) {
        });
      });
    });

    it('no route', function (done) {
      request = httpMocks.createRequest({
        method: 'GET',
        url: '/aaaBBB',
        query: {
          name: 'foo'
        },
      });

      response.on('end', function () {
        // console.log(response._getData());
        response.status(400);
        done();
      });

      var _this = this;
      raml.storeResponses(request, response, function next(error) {
        raml.express(request, response, function next(error) {
        });
      });
    });

});


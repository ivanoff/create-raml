'use strict';
var should = require('chai').should();
var Koa = require('koa');
var route = require('koa-route');
var Raml = require('../');

describe.skip('testing express', function () {

  beforeEach(function () {
    this.app = new Koa();
    this.app.use(route.get('/b', function (req, res) { res.send('b1:') }));
    this.app.use(route.post('/b', function (req, res) { res.send('b2:') }));
    this.app.use(route.get('/b/:id', function (req, res) { res.send('b3:' + req.params.id) }));
    this.app.use(route.delete('/b/:id', function (req, res) { res.send('b4:' + req.params.id) }));

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

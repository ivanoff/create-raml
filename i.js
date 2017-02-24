'use strict';

var fs = require('fs');

var Raml = require('./index');
var raml = new Raml({
  title: 'Testing Test',
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

raml.type('user', {
  name: { type: 'string', required: true },
  email: { type: 'email' },
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
/*
raml.generate(function(err, ramlText2) {

  console.log(ramlText2);

  fs.writeFile("test-raml2obj.raml", ramlText2, function(err) {
    console.log('===== raml2obj parsing =====');
    var raml2obj = require('raml2obj');
    raml2obj.parse('test-raml2obj.raml').then(function(ramlObj) {
      console.log('test-raml2obj passed');
    }, function(error) {
      console.log('Error raml2obj parsing: ' + error);
    });
  });

});
*/

/*!
 * create-raml
 * Copyright(c) 2017 ivanoff .$ curl -A cv ivanoff.org.ua
 * MIT Licensed
 */
'use strict';
var fs = require('fs');
var nunjucks = require('nunjucks');

exports = module.exports = function (options) {

  if (typeof options === 'undefined') var options = {};
  var typesData = {};
  var methodsData = {};

  return {
    type: function (name, obj) {
      return (typeof name === 'undefined') ? typesData
        : (typeof obj === 'undefined') ? typesData[name]
        : typesData[name] = obj;
    },

    methods: function (name, method, obj) {
      if (typeof name === 'undefined') {
        return methodsData;
      } else if (typeof method === 'undefined') {
        return methodsData[name];
      } else if (typeof obj === 'undefined') {
        methodsData[name] = method;
      } else {
        if (!methodsData[name]) methodsData[name] = {};
        methodsData[name][method] = obj;
      }
    },

    generate: function (cb) {
      var _this = this;
      fs.readFile('template/raml_1_0.mustache', function (err, template) {
        if (err) {
          cb(err);
        } else {
          var view = {
            options: options,
            typesData: typesData,
            stringify: function (value, replacer, space, indent) {
              return JSON.stringify(value, replacer, space).replace(/^/gm, Array(indent).join(' '));
            },
          };
          cb(null, nunjucks.renderString(template.toString(), view));
        }
      });
    },

  };

};

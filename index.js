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

      var url = Object.keys(methodsData).sort();
      var methodsTree = {};
      for( var i = url.length-1; i>=0; i-- ) {
        for( var j = i-1; j>=0; j-- ) {
          if(typeof methodsTree[url[i]] === 'undefined' && url[i].indexOf(url[j]+'/') == 0){
console.log(`${url[i]} -> ${url[j]}`);
            methodsTree[url[i]] = {
              shortLink : url[i].replace(url[j]+'/',''),
              deep: url[j].split('/').length
            };
          }
        }
        if(typeof methodsTree[url[i]] === 'undefined'){
          methodsTree[url[i]] = {shortLink: url[i], deep: 0};
        }
      }
console.log(methodsTree);
console.log(methodsData);
      fs.readFile('template/raml_1_0.nunjucks', function (err, template) {
        if (err) {
          cb(err);
        } else {
          var view = {
            options: options,
            typesData: typesData,
            methods: url,
            methodsTree: methodsTree,
            methodsData: methodsData,
            stringify: function (value, replacer, space, indent) {
              return JSON.stringify(value, replacer, space).replace(/^/gm, Array(indent).join(' '));
            },
            updatePath: function (path) {
              return path.replace(/\/:([^/:-]+)/g, '/{$1}');
            },
            regReplace: function( what, from, to, flags ) {
              return what.replace( new RegExp(from, flags), to );
            },
            repeat: function( what, count ) {
              return Array(count+1).join(what)
            },
          };
          cb(null, nunjucks.renderString(template.toString(), view));
        }
      });
    },

  };

};

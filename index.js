/*!
 * create-raml
 * Copyright(c) 2017 ivanoff .$ curl -A cv ivanoff.org.ua
 * MIT Licensed
 */
'use strict';
var fs = require('fs');
var path = require('path');
var nunjucks = require('nunjucks');

exports = module.exports = function (options) {
  var typesData = {};
  var methodsData = {};

  if (undef(options)) options = {};
  var ramlFile = (options.version === 0.8) ? 'raml_0_8.nunjucks' : 'raml_1_0.nunjucks';
  if (undef(options.templateFileName))
    options.templateFileName = path.resolve(__dirname, 'templates', ramlFile);

  var exp = {};

  exp.type = function (name, obj) {
    return (undef(name)) ? typesData
      : (undef(obj)) ? typesData[name]
      : typesData[name] = obj;
  }

  exp.methods = function (name, method, obj) {
    if (undef(name)) {
      return methodsData;
    } else if (undef(method)) {
      return methodsData[name];
    } else if (undef(obj)) {
      methodsData[name] = method;
    } else {
      if (undef(methodsData[name])) methodsData[name] = {};
      methodsData[name][method] = obj;
    }
  }

  exp.express = function (req, res) {
    if (options.express && Object.keys(methodsData).length === 0)
      methodsData = parseExpressData(options.express);
    this.generate(function (err, data) {
      res.send(data);
    });
  }

  exp.storeResponses = function (req, res, next) {
    var resEnd = res.end;

    res.end = function (chunk) {
      resEnd.apply(res, arguments);
      if(req.route) {
        var r = req.route;
        if(undef(methodsData[r.path])) methodsData[r.path] = {};
        if(undef(methodsData[r.path][r.stack.method]))
          methodsData[r.path][r.stack[0].method] = {
            description: r.stack[0].method + ' STORED ' + r.path,
          }

        var m = methodsData[r.path][r.stack[0].method];
        if(undef(m.responses)) m.responses = {};
        if(undef(m.responses[res.statusCode]))
          m.responses[res.statusCode] = {
            'application/json': {aaa:123},
            'application/text': 'hi!'
          };
      }
    };

    next();
  }

  exp.generate = function (cb) {
    fs.readFile(options.templateFileName, function (err, template) {
      if (err) {
        cb(err);
      } else {
        var view = {
          options: options,
          types: typesData,
          url: Object.keys(methodsData).sort(),
          methods: getMethodsTree(methodsData),
          f: additional(),
        };
        cb(null, nunjucks.renderString(template.toString(), view));
      }
    });
  }

  if(options.express) options.express.use(exp.storeResponses.bind(exp))

  return exp;

};

function undef(v) {
  return typeof v === 'undefined';
}

function additional() {
  return {
    stringify: function (value, replacer, space, indent) {
      return JSON.stringify(value, replacer, space).replace(/^/gm, Array(indent).join(' '));
    },

    updatePath: function (path) {
      return path.replace(/^([^\/])/, '/$1').replace(/:([^/:-]+)/g, '{$1}');
    },

    regReplace: function (what, from, to, flags) {
      return what.replace(new RegExp(from, flags), to);
    },

    repeat: function (what, count) {
      return Array(count + 1).join(what);
    },
  };
}

function getMethodsTree(methodsData) {
  var result = {};
  var url = Object.keys(methodsData).sort();
  for (var i = url.length - 1; i >= 0; i--) {
    for (var j = i - 1; j >= 0; j--) {
      if (undef(result[url[i]]) && url[i].indexOf(url[j] + '/') == 0) {
        result[url[i]] = {
          shortLink: url[i].replace(url[j] + '/', ''),
          deep: url[j].split('/').length,
          data: methodsData[url[i]],
        };
      }
    }

    if (undef(result[url[i]])) {
      result[url[i]] = { shortLink: url[i], deep: 0, data: methodsData[url[i]] };
    }
  }

  return result;
}

function parseExpressData(app) {
  if (undef(app) || undef(app._router)) return {};
  var s = app._router.stack;
  if (!Array.isArray(s)) return {};

  var result = {};
  for (var i = 0; i < s.length; i++) {
    if (undef(s[i])) continue;
    var r = s[i].route;
    if (undef(r) || undef(r.path) || undef(r.methods)) continue;
    if (undef(result[r.path])) result[r.path] = {};
    Object.keys(r.methods).forEach(function (method) {
      result[r.path][method] = {
        description: method + ' ' + r.path,
      };
    });
  }

  return result;
}


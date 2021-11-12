var path= require("path");
var _= require("lodash");
var defaultConfig = require('./assets/default')
var glob = require('glob');

var getGlobbedPaths = function (globPatterns, excludes) {
  var urlRegex = new RegExp('^(?:[a-z]+:)?\/\/', 'i');

  var output = [];

  if (_.isArray(globPatterns)) {
    globPatterns.forEach(function (globPattern) {
      output = _.union(output, getGlobbedPaths(globPattern, excludes));
    });
  } else if (_.isString(globPatterns)) {
    if (urlRegex.test(globPatterns)) {
      output.push(globPatterns);
    } else {
      var files = glob.sync(globPatterns);
      if (excludes) {
        files = files.map(function (file) {
          if (_.isArray(excludes)) {
            for (var i in excludes) {
              file = file.replace(excludes[i], '');
            }
          } else {
            file = file.replace(excludes, '');
          }
          return file;
        });
      }
      output = _.union(output, files);
    }
  }

  return output;
};

var initGlobalConfig = function () {
  var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};
  var config = environmentConfig;
  var configRoute = getGlobbedPaths(defaultConfig.server.routes);
  config.routes = configRoute;
  var configModel = getGlobbedPaths(defaultConfig.server.models);
  config.models = configModel;
  return config;
}


module.exports = initGlobalConfig();
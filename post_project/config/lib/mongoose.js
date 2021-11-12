var chalk = require('chalk');
var path = require('path');
var mongoose = require('mongoose');
var config = require('../config');

mongoose.Promise= Promise;

module.exports.loadModels = function (callback) {
  config.models.forEach(function (modelPath) {
    require(path.resolve(modelPath));
  });

  if (callback) callback();
};

module.exports.connect = function (cb) {
  mongoose.connect(config.db.uri, function (err) {

    if (err) {
      console.error(chalk.red('Could not connect to MongoDB!'));
    } else {
      if (cb) cb(mongoose);
    }
  });
};
'use strict';

/**
 * Module dependencies.
 */
var config = require('../config'),
  mongoose = require('./mongoose'),
  express = require('./express'),
  chalk = require('chalk');
var cors = require('cors')

var app;


module.exports.init = function init(callback) {
  mongoose.connect(function (db) {
    mongoose.loadModels(() => {
      app = express.init(db);
      if (callback) callback(app, db, config);
    })
  });
};

module.exports.start = function start(callback) {
  var _this = this;

  _this.init(function (app, db, config) {
    app.use(cors());

    // Start the app by listening on <port>
    app.listen(config.port, function () {

      // Logging initialization
      console.log('--');
      console.log(chalk.green('Environment:\t\t\t' + process.env.NODE_ENV));
      console.log(chalk.green('Port:\t\t\t\t' + config.port));
      console.log(chalk.green('Database:\t\t\t\t' + config.db.uri));
      if (process.env.NODE_ENV === 'secure') {
        console.log(chalk.green('HTTPs:\t\t\t\ton'));
      }

      if (callback) callback(app, db, config);
    });

  });

};


module.exports.close = function close(callback) {
  app.close(function (err) {
    if (callback) callback(err);
  });
};
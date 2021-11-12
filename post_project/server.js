'use strict';

process.title = 'API';
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config({ path: '.env' });
}

var app = require('./config/lib/app');
var server = app.start(function() {});

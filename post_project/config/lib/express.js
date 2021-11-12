var express = require('express');
var bodyParser = require('body-parser');
var config = require('../config')
var path = require('path')


module.exports.initMiddleware = function(app){
    app.use(bodyParser.urlencoded({
      extended: true,
        limit: '5mb'
    }));
    app.use(bodyParser.json({
      limit: '5mb',
    }));
}

const initModulesServerRoutes = function (app) {
  config.routes.forEach(function (routePath) {
    require(path.resolve(routePath))(app);
  });
};


module.exports.init = function(){
    var app = express();
    this.initMiddleware(app);
    initModulesServerRoutes(app)
    return app;
}
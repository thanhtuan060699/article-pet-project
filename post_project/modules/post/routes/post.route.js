'use strict'
var postController = require('../controllers/post.controller');

module.exports = (app) =>{
    app.route('/api/post/:id')
       .delete(postController.delete) 
       .get(postController.get)
       .put(postController.update);
    app.route('/api/post').post(postController.save);
    app.route('/api/post/statistic/day').get(postController.statisticPostDay);
    app.route('/api/post/statistic/category').get(postController.statisticPostCategory);
}

/*
 * GET home page.
 */

//var codein = require('node-codein');
exports.index = function(req, res){
   //reqObj = req.io.route();
    reqObj = req
    req.io.route('hello')
   res.render('home', { title: 'Express' });
};


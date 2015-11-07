
/*
 * GET home page.
 */

var db = require('../db');

exports.index = function(req, res) {
  res.render('index', { title: 'lmao' });
};
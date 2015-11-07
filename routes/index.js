
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: process.env.MYSQLCONNSTR_happmeA55zn8H64V });
};
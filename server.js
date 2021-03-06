
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./controllers')
  , api = require('./controllers/api_controller')
  , db = require('./db')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.post('/record_story', api.record_story);
app.post('/change_contact', api.change_contact);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

process.on('SIGINT', function() {
  db.connection.end(function(err) {
    process.exit();
  });
});
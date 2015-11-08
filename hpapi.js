// TODO
var querystring = require('querystring');
var http = require('http');

module.exports = {
  get_sentiment: function (text, callback){

    var host        = 'http://api.havenondemand.com';
    var path        = '/1/api/sync/analyzesentiment/v1?';
    var query_text  = querystring.stringify({
      text: text.replace(" ", "+"),
      language: "eng", 
      apikey: "6a4d092a-3a56-46b9-9382-3d8b1637a5d8"});

    var body = ''

    console.log("QUERY_TEXT: " + query_text);

    http.get(host + path + query_text, function(res){
      res.on('data', function(d){
        body += d;
      });

      res.on('end', function(){
        body = JSON.parse(body);
        callback(body);
        return;
      })
    }).on('error', function(e){
      callback(false);
      return;
    });
  }
}
// TODO

module.exports = {
  get_sentiment: function (text){

    var host        = 'http://api.havenondemand.com';
    var path        = '/1/api/sync/analyzesentiment/v1?';
    var query_text  = querystring.stringify({
      text: text.replace(" ", "+"),
      language: "eng", 
      apikey: "6a4d092a-3a56-46b9-9382-3d8b1637a5d8"});

    var body = ''
    http.get(host + path + query_text, function(res){
      res.on('data', function(d){
        body += d;
      });

      res.on('end', function(){
        body = JSON.parse(body);
        console.log(body);
      })
    }).on('error', function(e){
      console.log("Got an error: ", e);
    });
  }
}
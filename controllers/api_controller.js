var users = require('../users');
var hpapi = require('../hpapi');
var triggers = require('../triggers');
var mailer = require('../mailer');

exports.record_story = function(req, res) {

  // UID
  // checked
  // contact
  var uid = req.body.uid;

  users.get_or_create_user(uid, function(success){
    if(success == false){
      res.send("error");
      return;
    }

    // req params: post_id, user_id, contents, filtering
    var concatenated_text = "";
    var content           = req.body.contents;
    var filtering         = req.body.filtering;

    console.log(req.body);

    // concatenate all text in content
    for(var key in content){
      console.log("found key " + key + " with val "+ content[key]);
      concatenated_text += ". " + content[key];
    }

    // Trigger stuff
    if (req.body.triggers) {
      var text_tokens = triggers.split_sanitize(concatenated_text);
      var user_triggers = req.body.triggers.split(',');

      for (var i=0; i<user_triggers.length; i++) {
        var trigger = user_triggers[i];
        if (triggers.weight_trigger(trigger, text_tokens) >= 0.4) { // TODO: look to see if this cutoff makes sense
          res.send({"remove": true, "prompt" : true});
          return;
        }
      }
    }

    console.log("CONCATENATED TEXT: " + concatenated_text);

    // query hp sentiment api
    hpapi.get_sentiment(concatenated_text, function(res1){
      if(res1 == false){
        return;
      } else {
        var aggregate = res1.aggregate.score;

        console.log(aggregate);


        // log aggregate in database
        users.update_block(uid, aggregate, function(success1){

          console.log("GOT HERE: " + success1);

          if(success1 == false){
            res.send("error");
            return;
          }else{
            if(aggregate > 0){

              // we got a non-negative result
              res.send({"remove": false, "prompt" : false});
              return;
            }

            if(filtering == true){
              res.send({"remove": true, "prompt" : false});
              return;
            }

            // user has filtering off, decide whether or not to filter
            users.get_weeks_score(uid, function(score){
              if(score == false){
                return;
              }else{
                if(score > -.5){
                  res.send({"remove": false, "prompt" : false});
                  return;
                }
                console.log("SCORE: " + score);

                var ourdate = new Date();

                // should we prompt?
                console.log("original ourdate: "+ ourdate);
                users.did_ask_long_enough_ago(uid, ourdate, function(should_prompt){
                  if(should_prompt == true){
                    
                    users.make_prompt_time_now(uid, ourdate, function(arg){ return; });
                    res.send({"remove": true, "prompt" : true});

                    users.get_contact_email(uid, function(email){
                      if(email == false){
                        console.log("Could not get contact email");
                        return;
                      }
                      m = mailer.get_mailer();
                      mailer.send(email, uid + " is having a negative browsing experience. You may want to check on him/her.", m, function(){
                        console.log("Successfully sent email away!");
                      });
                    });
                    return;
                  }else if(should_prompt == false){
                    res.send({"remove": true, "prompt" : false});
                    return;
                  }
                })
              }
            });
          }
        });
      }
    });
  });
};

exports.change_contact = function(req, res) {
  var uid = req.body.uid;
  var contact_email = req.body.contact_email;

  users.get_or_create_user(uid, function(worked) {
    if (worked) {
      users.update_contact(uid, contact_email, function(worked1) {
        res.send(worked1 ? 200 : 400)
      });
    } else {
      res.send(400);
    }
  });
};

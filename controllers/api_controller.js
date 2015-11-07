var users = require('../users');
var hpapi = require('../hpapi');

exports.record_story = function(req, res) {

  // UID
  // checked
  // contact
  var uid = req.params.uid;

  users.get_or_create_user(uid, function(success){
    if(success == false){
      res.send("error");
      return;
    }

    // req params: post_id, user_id, contents, filtering
    var concatenated_text = "";
    var content           = req.params.contents;
    var filtering         = req.params.filtering;

    // concatenate all text in content
    for(var key in content){
      if(content.hasOwnProperty(key)){
        content += ". " + content[key];
      }
    }

    // query hp sentiment api
    hpapi.get_sentiment(text, function(res1){
      if(res1 == false){
        return;
      }else {
        var aggregate = res1.aggregate.score;

        // log aggregate in database
        users.update_block(uid, aggregate, function(sucess1){
          if(success1 == false){
            return;
          }else{
            if(aggregate > 0){

              // we got a non-negative result
              res.send("positive");
              return;
            }

            if(filtering == true){
              res.send("negative");
              return;
            }


            // get weekly score
            users.get_weeks_score(uid, function(score){
              if(score == false){
                return;
              }else{

                // get last time prompted
                users.get_last_prompt(uid, function(last_prompt){
                  if(last_prompt != false){
                    // TODO if less than a week ago, update last_prompt and return negative and prompt
                  }
                })
              }
            });
          }
        });
      }
    });
  });

  res.send("go away");
};

exports.change_contact = function(req, res) {
  var uid = req.body.uid;
  var contact_email = req.body.contact_email;

  users.get_or_create_user(uid, function(worked) {
    if (worked) {
      users.update_contact(uid, contact_email, function(worked1) {
        res.write(worked1);
      });
    } else {
      res.write(false);
    }
  });
};

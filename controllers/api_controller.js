var users = require('../users');

exports.record_story = function(req, res) {
  // UID
  // checked
  // contact
  var uid = req.params.uid;

  // users.get_or_create_user(uid, function(worked) {
    // console.log(worked);
  // });

  res.send("go away");
};


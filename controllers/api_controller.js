var users = require('../users');

exports.record_story = function(req, res) {
  // UID
  // checked
  // contact
  var uid = req.params.uid;

  users.get_or_create_user(uid, function(worked) {
    console.log(worked);
    users.get_weeks_score(uid, function(resp) {
      console.log(resp);
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

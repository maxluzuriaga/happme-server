var db = require('./db');

// Callback returns with value true if user existed or was created, or false if there was an error
exports.get_or_create_user = function(uid, callback) {
  db.connection.query("select * from users where `username` = ?", [uid], function(error, results, fields) {
    if (error != null) {
      callback(false);
      return;
    }

    if (results.length == 1) {
      callback(true);
    } else {
      db.connection.query("insert into users set `username` = ?", [uid], function(error, results, fields) {
        if (error != null) {
          callback(false);
        } else {
          callback(true);
        }
      });
    }
  });
};
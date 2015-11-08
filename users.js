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
      db.connection.query("insert into users set `username` = ?", [uid], function(error1, results1, fields1) {
        callback(error1 == null);
      });
    }
  });
};

exports.update_contact = function(uid, email, callback) {
  db.connection.query("update users set `contact_email` = ? where `username` = ? ", [email, uid], function(error, results, fields) {
    callback(error == null);
  });
};

exports.get_contact_email = function(uid, callback) {
  db.connection.query("select `contact_email` from users where `username` = ?", [uid], function(error, results, fields) {
    if (error != null) {
      callback(false);
      return;
    }

    callback(results[0].contact_email);
  });
};

exports.did_ask_long_enough_ago = function(uid, callback) {
  db.connection.query("select `last_prompt` from users where `username` = ?", [uid], function(error, results, fields) {
    if (error != null) {
      callback(false);
      return;
    }
    var last_date = results[0].last_prompt;

    var d = new Date();
    d.setDate(d.getDate() - 7);

    callback(last_date == null || last_date <= d);
  });
};

exports.make_prompt_time_now = function(uid, callback) {
  db.connection.query("update `users` set `last_prompt` = NOW() where `username` = ?", [uid], function(error, results, fields) {
    callback(error == null);
  });
};

exports.get_weeks_score = function(uid, callback) {
  var d = new Date();
  d.setDate(d.getDate() - 7);

  db.connection.query("select sum(tally) from blocks where `username` = ? and `start_time` >= ?", [uid, d], function(error, results, fields) {
    if (error != null) {
      callback(false);
      return;
    }

    var result = results[0]['sum(tally)'];
    if (result == null) {
      result = 0.0;
    }

    callback(result);
  });
};

// rounds down to 12 hour interval
exports._current_time_block = function () {
  var d = new Date();
  d.setMinutes(0);
  d.setSeconds(0);

  if (d.getHours() < 12) {
    // first 12 hours
    d.setHours(0);
  } else {
    // last 12 hours
    d.setHours(12);
  }

  return d;
}

exports.update_block = function(uid, value, callback) {
  var block = _current_time_block();

  db.connection.query("select id from blocks where `username` = ? and `start_time` = ?", [uid, block], function(error, results, fields) {
    if (error != null) {
      callback(false);
      return;
    }

    if (results.length == 1) {
      // update
      var id = results[0].id;
      var tally = results[0].tally;
      db.connection.query("update blocks where `id` = ? set `tally` = ?", [id, tally+value], function(error1, results1, fields1) {
        callback(error1 == null);
      });
    } else {
      // create
      db.connection.query("insert into blocks set `username` = ? and `start_time` = ? and `tally` = ?", [uid, block, value], function(error1, results1, fields1) {
        callback(error1 == null);
      });
    }
  });
};

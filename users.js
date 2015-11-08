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

exports.did_ask_long_enough_ago = function(uid, date, callback) {
  console.log("did ask long enough received: " + date);
  db.connection.query("select `last_prompt` from users where `username` = ?", [uid], function(error, results, fields) {
    if (error != null) {
      callback(false);
      return;
    }
    var last_date = results[0].last_prompt;

    var d = date;
    d.setHours(d.getHours() + 5);
    d.setMinutes(d.getMinutes() - 1);

    console.log("last date: " + last_date + ", now minus one minute: " + d);

    callback(last_date == null || last_date <= d);
  });
};

exports.make_prompt_time_now = function(uid, date, callback) {
  date = new Date();
  console.log("updating new time:" + date);
  datestring = date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
  db.connection.query("update `users` set `last_prompt` = ? where `username` = ?", [datestring, uid], function(error, results, fields) {
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
  var block = exports._current_time_block().toISOString().replace(/T/, ' ').replace(/\..+/, '');

  console.log(uid + " " + value);

  db.connection.query("select id, tally from blocks where `username` = ? and `start_time` = ?", [uid, block], function(error, results, fields) {
    if (error != null) {
      callback(false);
      return;
    }

    if (results.length == 1) {
      // update
      var id = results[0].id;
      var tally = results[0].tally;
      db.connection.query("update blocks set `tally` = ? where `id` = ?", [tally + value, id], function(error1, results1, fields1) {
        callback(error1 == null);
        return;
      });
    } else {
      // create
      console.log("AHH GOT HERE! " + uid + " " + block + " " + value);
      db.connection.query("insert into blocks (username, start_time, tally) values (?, ?, ?)", [uid, block, value], function(error1, results1, fields1) {
        callback(error1 == null);
        return;
      });
    }
  });
};

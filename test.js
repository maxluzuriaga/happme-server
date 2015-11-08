process.env.MYSQLCONNSTR_happmeA55zn8H64V='Database=happmeA55zn8H64V;Data Source=us-cdbr-azure-east-a.cloudapp.net;User Id=b3c0197a40176c;Password=d5ee9a9b'

a = require("./users");

db = require("./db");

a.did_ask_long_enough_ago("Tyler Petrochko", function(value){console.log(value);});


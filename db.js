var mysql = require('mysql');

conn_str = process.env.MYSQLCONNSTR_happmeA55zn8H64V

tokens = conn_str.split(';');
database = tokens[0].split('=')[1];
host = tokens[1].split('=')[1];
user = tokens[2].split('=')[1]
password = tokens[3].split('=')[1]

database_url = "mysql://" + user + ":" + password + "@" + host + "/" + database;

exports.connection = mysql.createConnection(database_url);

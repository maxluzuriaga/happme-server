var nodemailer = require("nodemailer");

module.exports = {

  get_mailer: function () {
    var smtpTransport = nodemailer.createTransport("SMTP",{
      service: "Gmail",
      auth: {
        user: "team.happme",
        pass: "squadpassword"
      }
    });

    return smtpTransport;
  },

  send: function (to, body, mailer, callback){
    var mailOptions = {to: to, 
      subject : "Notification from happme",
      text : body
    };

    mailer.sendMail(mailOptions, function(error, response){
      if(error){
        callback(error);
      }else{
        callback(response);
      }
    });
  }
}
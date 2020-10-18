const nodemailer = require('nodemailer');
const {email, password, slackSigningSecret} = require('./credential/mypass')

let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
       user: email,
       pass: password
   }
});

 
module.exports = function replyEmail (from, to, replyTo, inReplyTo, references, subject, text) {
    let replyOptions = {
        from: from, 
        to: to,
        replyTo: replyTo,
        inReplyTo : inReplyTo,
        references : references,
        subject: subject,
        text: text
    };

    transporter.sendMail(replyOptions, function(err, data) {

        if (err) {
            console.log('Error Occurs', err);
        } else {
            console.log('Email Sent!!!');
        }
     });     
}

 
module.exports = function sendEmail (from, to, subject, text) {
    let sendOptions = {
        from: from, 
        to: to,
        subject: subject,
        text: text
    };

    transporter.sendMail(sendOptions, function(err, data) {

        if (err) {
            console.log('Error Occurs', err);
        } else {
            console.log('Email Sent!!!');
        }
     });     
}


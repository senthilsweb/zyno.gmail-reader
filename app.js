require('dotenv').config();
var notifier = require('mail-notifier')
, fs = require('fs')
, stream = require('stream')

/*
Uncomment this if you want to bring the variables from config.json
var filename = __dirname + "/config.json";
var config = JSON.parse (fs.readFileSync(filename,'utf8'));
*/

var imap = {
        user: process.env.USERNAME,
        password: process.env.PASSWORD,
        host: process.env.IMAP_HOST,
        port: process.env.IMAP_PORT,
        tls: process.env.IMAP_TLS,
        search : [ 'UNSEEN', ['SINCE', process.env.EMAIL_SEARCH_FILTER_SINCE], ['BEFORE', process.env.EMAIL_SEARCH_FILTER_BEFORE] ],
        tlsOptions: { rejectUnauthorized: false }
};

//---------------------------------------------------------------------------------------------------------
// Mail Processor  mail receive event
//---------------------------------------------------------------------------------------------------------
var mailProcessor  = notifier(imap).on('mail', function (mail) {

        //Build a custom json email message from "mail" object.
        //mail has lot of other properties, please use it as per your requirement.
    var msg = {};
    msg.date = mail.date;
    msg.plaintextbody = mail.text;
    msg.subject = mail.subject;
    msg.to = JSON.stringify(mail.to);
    msg.id = mail.messageId;
    msg.from = JSON.stringify(mail.from);
    
    //Check for attachments, if exists extract each attachment and save it to the file system ["uploads" folder] 
    if (mail.attachments) {
        console.log("Inside attachment check function!");
        mail.attachments.forEach(function (attachment) {
            console.log("Iterating attachment");    
            console.log("Filename = " + attachment.generatedFileName);
            var regex = new RegExp("([a-zA-Z0-9\s_\\.\-:])+(" + process.env.EMAIL_ATTACHMENT_EXT_ALLOWED + ")$");
            if (regex.test(attachment.generatedFileName.toLowerCase())){
                console.log(__dirname + process.env.EMAIL_ATTACHMENTS_DIRECTORY + attachment.generatedFileName)
                fs.writeFile( __dirname + process.env.EMAIL_ATTACHMENTS_DIRECTORY + attachment.generatedFileName, attachment.content, 'base64', function(err) {
                    if (err!=null)
                        console.log("Error = " + err);
                    console.log("Attachment was saved!");
                 });
            }
        });
        //[Optional]Save the email message to file system as .txt/.json
        fs.writeFile(__dirname + process.env.EMAIL_MESSAGES_DIRECTORY  + mail.messageId + '.txt', JSON.stringify(msg), function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The file was saved!");
                }
            }
        );
        }
});

//---------------------------------------------------------------------------------------------------------
// Mail Processor end event
//---------------------------------------------------------------------------------------------------------
mailProcessor.on('end',function(){
  console.log('Mail Processor  ended');
});

//Star the Mail Processor
mailProcessor.start();

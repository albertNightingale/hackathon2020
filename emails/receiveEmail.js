const fs = require('fs');
const { google } = require('googleapis');
const credentialAuthorize = require('../credential');

let ls = []

module.exports = async function getEmailList() {

  await fs.readFile('credential/credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Gmail API.
     (async () => {
       await credentialAuthorize(JSON.parse(content), listEmails);
     })().then( () => console.log(ls));
  });

  // console.log(ls)
  return ls;
}

/****
 * list emails
 */
function listEmails(auth) {
  // auth step
  const gmail = google.gmail({ version: 'v1', auth });

  // list all the files  
  gmail.users.messages.list({
    userId: 'me',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);

    let gmailMessageList = res.data.messages;

    if (gmailMessageList.length) {
      for (var messageIdx = 0; messageIdx < gmailMessageList.length; messageIdx++) {
        var obj = getOneEmail(auth, gmailMessageList[messageIdx]);
        ls.push(obj);
      }
    }
    else {
      console.log('No messages found.');
    }
  })
}

function getOneEmail(auth, messageIDObj) {
  const gmail = google.gmail({ version: 'v1', auth });

  const base64 = require('js-base64').Base64;

  const id = messageIDObj.id;

  gmail.users.messages.get({ userId: 'me', id: id, format: 'full' }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);

    // subject 
    var headerSubject = res.data.payload.headers.find(header => header.name === 'Subject').value;

    // date
    var dateObj = res.data.payload.headers.find(header => header.name === 'Date').value;
    var date = Date.parse(dateObj);
    var currentTime = Date.now()
    var twoDays = 2 * 86400 * 1000;

    if (date - currentTime > twoDays) {
      return;
    }

    // email ID
    var id = res.data.payload.headers.find(header => header.name === 'Message-ID')
    if (id === undefined) return;
    
    messageID = id.value;

    // label
    var labelId = res.data.labelIds.find(label => label === 'UNREAD')

    if (labelId === undefined) {
      return;
    }

    // getting the body
    var data = res.data.payload.body.data;
    if (data !== undefined) {

      var decodedPlainContent = base64.decode(data);


      var emailObject = {
        messageID: messageID,
        date: date,
        labelId: labelId,
        subject: headerSubject,
        body: decodedPlainContent
      }

      return emailObject;
      // ls.set(emailObject.messageID, emailObject);
      // console.log(emailObject, '\n\n');
    }

  })
}
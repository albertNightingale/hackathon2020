const getEmailList = require('./emails/receiveEmail')
// const {list} = require('./emails/receiveEmail')

// module.exports = require('./src/app.js');

getEmailList().then((map) => console.log(map.size));



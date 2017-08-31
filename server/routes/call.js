// Twilio Credentials
const accountSid = 'AC2afce28ef667457d0f2b189257fa94ef';
const authToken = 'e885fc2760ad02d353cf971107d211c0';
// require the Twilio module and create a REST client
const client = require('twilio')(accountSid, authToken);
client.messages
 .create({
   to: '+4915214301194',
   from: '+16308830128',
   body: "Fire alert",
 })
 .then((message) => console.log(message.sid)); 

require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 5000;
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
const bodyParser = require('body-parser');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(bodyParser.json());

app.post('/sendsms', (req, res) => {
  console.log(req.body);
  client.messages
  .create({
     body: 'This is the ship that made the Kessel Run in fourteen parsecs?',
     from: '+18563865091',
     to: req.body.receiver
   })
  .then(message => {
    console.log(message.sid)
    res.end();
  });
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
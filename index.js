require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 5000;
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_TOKEN);
const bodyParser = require('body-parser');
var cors = require('cors');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(bodyParser.json());
app.use(cors());

app.use(function (req, res, next){
  if (req.headers['x-forwarded-proto'] === 'https') {
    res.redirect('http://' + req.hostname + req.url);
  } else {
    next();
  }
});

app.post('/sendsms', (req, res) => {
  console.log(req.body);
  client.messages
    .create({
      body: req.body.sms,
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
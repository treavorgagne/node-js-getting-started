require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 5000;
const client = require('twilio')(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_TOKEN
);
const bodyParser = require('body-parser');
const Gen2FA = require('./Gen2FA');
const gen = new Gen2FA(2, 4 * 60 * 1000, '123abc');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

app.post('/sendsms', (req, res) => {
  console.log(req.body);
  client.messages
    .create({
      body: req.body.sms,
      from: '+18563865091',
      to: req.body.receiver
    })
    .then((message) => {
      console.log(message.sid);
      res.end();
    });
});

app.post('/login', (req, res) => {
  const result = gen.check2FA(req.body.token, req.body.uid);
  if (result === true) {
    console.log('success to ', req.body.success);
    res.redirect(300, req.body.success);
  } else {
    console.log('fails to ', req.body.failure);
    res.redirect(307, req.body.failure);
  }
});

app.post('/token-verify', (req, res) => {
  const result = gen.check2FA(req.body.token, req.body.uid);
  console.log(req.body, result);
  if (result === true) {
    res.status(200).send({ cookie: 'authorized', msg: 'PASSCODE ACCEPTED' });
  } else {
    res.status(404).send('PASSCODE INCORRECT');
  }
});

app.post('/token-send', (req, res) => {
  const token = gen.make2FA(req.body.uid);
  client.messages
    .create({
      body: req.body.uid + ' your token is ' + token,
      from: '+18563865091',
      to: req.body.receiver
    })
    .then((message) => {
      console.log(message.sid);
      res.status(200).send(`CODE SENT ${token}`).end();
    });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const accountSid = 'AC8ebaaed2b61eb51220722443231ca571';
const authToken = 'b2c9d35d2d28b44575ffba1252a0c542';
const client = require('twilio')(accountSid, authToken);
const bodyParser = require('body-parser');
const cors = require('cors');

express()
  .use(express.static(path.join(__dirname, 'public')))
  // .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .post('/sendsms', (req, res) => {
        client.messages
          .create({body: req.body.sms, from: '+18563865091', to: req.body.receiver})
          .then(message => {
              console.log(message.sid, req.body);
              res.send(200);
          }) 
      })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
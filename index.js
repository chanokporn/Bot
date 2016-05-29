var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var request = require('request')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('hello word')
})
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'pai') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i]
    sender = event.sender.id
    if (event.message && event.message.text) {
      var text = event.message.text.split(' ')
      if (text[0] === 'sum') {
        var ans = parseInt(text[1], 0) + parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      } else if (text[0] === 'max') {
        ans = parseInt(text[1], 0) > parseInt(text[2], 0) ? parseInt(text[1], 0) : parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      } else if (text[0] === 'min') {
        ans = parseInt(text[1], 0) < parseInt(text[2], 0) ? parseInt(text[1], 0) : parseInt(text[2], 0)
        sendTextMessage(sender, ans)
      } else if (text[0] === 'avg') {
        text.splice(0, 1)
        var sum = text.reduce((prev, curr) => prev + parseInt(curr, 0), 0)
        console.log(sum)
        ans = sum / text.length
        sendTextMessage(sender, ans)
      }
      // text = event.message.text
      // // Handle a text message from this sender
      // console.log(text)
      // sendTextMessage(sender, text)
    }
  }
  res.sendStatus(200)
})
var token = 'CAAC6ztUEGKoBAPJykQZCbgRr2A9ebyPIlwrF9FVqTAB8QIxe8sHMZB7kiltQ9Uac6WD79rxcb5tmPFff4llfJndtGZBDoNCDzZAtuDFNShx6owAQCL7nrvOjBRcSB9YmGdEBgd7GOlw4x9i4o6by9zpah4C2b0ihktniQCLk7Nm2YFWviUBKP0VqYlyJMfIZD'
function sendTextMessage (sender, text) {
  messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}
app.set('port', (process.env.PORT || 3000))
app.listen(app.get('port'), function () {
  console.log('Server Start at port', app.get('port'))
})

var express = require('express')
var app = express()
app.get('/', function (req, res) {
  res.send('hello word')
})
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'pai') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function () {
  console.log('Server Start at port', app.get('port'))
})

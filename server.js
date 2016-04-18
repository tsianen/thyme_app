var express = require('express');
//modules we need
var app = express(),
    http = require('http'),
    server = http.createServer(app),
    bodyParser = require('body-parser'),
    expressValidator = require('express-validator'),
    path = require('path');


//stuff we need
app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // for parsing application/x-www-form-urlencoded
app.use(expressValidator({})); // this line must be immediately after express.bodyParser()!

app.set('view engine', 'jade');

app.use('/', express.static(__dirname + '/views'));

server.listen(process.env.PORT || 3000, function() {
  console.log('App listening at port 3000...');
})

app.get('/*/.:format?', function(req, res) {
  res.render('index');
})
'use strict';
var express = require('express')
  , app     = express();

var port = 3000;

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.get('/', function(req, res) {
  res.send('Ok');
});

app.listen(port);

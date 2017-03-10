'use strict';

// tools/server.js

// npm install express
// npm install socket.io

/*
var io = require('socket.io');
var http = require('http');
var express = require('express');
var app = module.exports.app = express();
var server = http.createServer(app);
const spawn = require('child_process').spawn;
const fs = require('fs');
*/

var express = require('express');
var webpack = require('webpack');
var path = require('path');
var open = require('open');

var config = require('../webpack.config.dev');
var port = 3000;
var app = express();
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../src/index.html'));
});

var server = app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    open('http://localhost:' + port);
  }
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log('a user connected');

  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

/*
app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
    //res.send('Hello World');
});

server.listen(3000);

var socket = io.listen(server);

socket.on('connection', function (client) { 
  const args = ["-jar", "/var/www/html/HiddenPhrase/AJAXTest.jar"];
  const proc = spawn('java', args);
  
  socket.emit('init', {
    msg: "Hello!"
  });
  
  proc.stdout.on('data', function (data) {
    socket.broadcast.emit('send:message', {
      text: '' + data
    });
  });
  
  client.on('message', function (msg) {
    console.log('client: ' + msg);
  });

  client.on('disconnect', function () {
    
  });
});
*/

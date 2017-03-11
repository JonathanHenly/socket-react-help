'use strict';

// tools/server.js

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
// var webpack = require('webpack');
var path = require('path');
var open = require('open');
var spawn = require('child_process').spawn;
var fs = require('fs');

// const config = '../webpack.config.js';
var port = 3000;
var app = express();
// const compiler = webpack(config);

/*
app.use(require('webpack-dev-middleware')
		(compiler, {
			noInfo: true,
			publicPath: config.output.publicPath
		}));

app.use(require('webpack-hot-middleware')
		(compiler));
*/

app.get('/', function (req, res) {
  console.log("get /");
  res.sendFile(path.join(__dirname, '../../index.html'));
});

app.get('/HiddenPhrase', function (req, res) {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

var server = app.listen(port, function (err) {
  if (err) {
    console.log(err);
  } else {
    // open(`http://localhost:${port}`);
  }
});

var io = require('socket.io')(server);

io.on('connection', function (socket) {
  console.log('User Connected');

  socket.emit('init', {
    message: "Initialized Connection"
  });

  socket.on('unscramble:word', function (data) {
    var recWhat = 'Received: {';

    if (data.word !== '') {
      recWhat += 'word: ' + data.word;
    }

    if (data.count !== '') {
      if (data.word !== '') {
        recWhat += ', ';
      }

      recWhat += 'count: ' + data.count;
    }

    recWhat += '}';

    console.log(recWhat);
    console.log('Running java -jar "/var/www/html/HiddenPhrase/lib/Test.jar" ' + data.word + ' ' + data.count);

    socket.emit('resp:message', {
      message: recWhat
    });

    var args = ["-jar", "/var/www/html/HiddenPhrase/lib/Test.jar", data.word, data.count];
    var proc = spawn('java', args);

    proc.stdout.on('data', function (output) {
      socket.emit('resp:output', {
        output: '' + output,
        title: data.word + ' ' + data.count
      });
    });
  });

  socket.on('disconnect', function () {
    console.log('User Disconnected');
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
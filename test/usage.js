var fs = require('fs'),
    http = require('http'),
    EventSync = require('../');

var evsync = new EventSync();

fs.readFile('foo.txt', 'utf8', function (err, data) {
  if (err) {
    evsync.open('error', err);
  } else {
    evsync.open('load', data);
  }
});

http.createServer(function (req, res) {
  evsync.once('load', function (file) {
    res.writeHead(200);
    res.end(file);
  });
  evsync.once('error', function (err) {
    res.writeHead(500);
    res.end('Failed to load the file.');
  });
}).listen(8124);
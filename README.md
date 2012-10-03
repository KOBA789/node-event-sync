# EventSync

This controls flow by events like flags.

## Usage

If you want to make a http server serving a static file and load file before handling the requests, you can put http.createServer() in the callback of fs.readFile(). But it makes a too deep nest.
Now, with EventSync, you can write the code like this. 

```JavaScript
var fs = require('fs'),
    http = require('http'),
    EventSync = require('evsync');

var evsync = new EventSync();

fs.readFile('foo.txt', 'utf8', function (err, data) {
  if (err) {
    evsync.open('error', err);
  } else {
    evsync.open('load', file);
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
```
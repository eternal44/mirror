var express = require('express');

var app = express();

require('./config/middleware.js')(app, express);

app.listen(3000);

module.exports = app;










// will CORS be an issue?
// use server as a proxy between 3rd party resource & my client
// time will be an issue








var http = require('http');
var net = require('net');
var url = require('url');

// Create an HTTP tunneling proxy
var proxy = http.createServer(function (req, res) {
res.writeHead(200, { 'Content-Type': 'text/plain' });
res.end('okay');
     });
     proxy.on('connect', function (req, cltSocket, head) {
       // connect to an origin server
       var srvUrl = url.parse('http://' + req.url);
       var srvSocket = net.connect(srvUrl.port, srvUrl.hostname, function () {
         cltSocket.write('HTTP/1.1 200 Connection Established\r\n' + 'Proxy-agent: Node.js-Proxy\r\n' + '\r\n');
         srvSocket.write(head);
         srvSocket.pipe(cltSocket);
         cltSocket.pipe(srvSocket);
       });
     });

     // now that proxy is running
     proxy.listen(1337, '127.0.0.1', function () {

       // make a request to a tunneling proxy
       var options = {
         port: 1337,
         hostname: '127.0.0.1',
         method: 'CONNECT',
         path: 'www.google.com:80'
       };

       var req = http.request(options);
       req.end();

       req.on('connect', function (res, socket, head) {
         console.log('got connected!');

         // make a request over an HTTP tunnel
         socket.write('GET / HTTP/1.1\r\n' + 'Host: www.google.com:80\r\n' + 'Connection: close\r\n' + '\r\n');
         socket.on('data', function (chunk) {
           console.log(chunk.toString());
         });
         socket.on('end', function () {
           proxy.close();
         });
       });
     });

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var http = require('http');

var server = require('http').createServer(app);
var io = require('socket.io')(server);

// Open port for socket communication
server.listen(process.env.PORT || 3000);
console.log('Listening on port 3000 for socket...');

// Request API access: https://www.yelp.com/developers/v3/preview
var Yelp = require('yelp-v3');

var yelp = new Yelp({
  access_token: process.env.YelpAPIKey,
});

// Serve index.html
app.use('/', express.static(__dirname + '/public'));

io.on('connection', function (socket) {

  // Receive user's coordinates
  socket.on('coords', function (location) {
    console.log('Receieved user coords');
    // Make query to send to Yelp
    var query = Object.assign({
      term: 'coffee',
      radius: '500'
    }, location)
    console.log(query);
    // Call Yelp API
    yelp.search(query, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log('Made a request to yelp');
        console.log(data);
        // app.get('/api.json', function (req, res) {
        //     console.log('request was made' + req.url);
        //     res.set({
        //       'Content-Type': 'application/json',
        //       'Access-Control-Allow-Origin': '*'
        //     });
        //     res.status(200).json(data);
        //   });
            socket.emit('jsonReady', data);
          }
        });
    });
  });

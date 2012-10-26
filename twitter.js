var twitter = require('ntwitter');
var io = require('socket.io').listen(1337); //WebSocket listening on port 1337

//Open connection to twitter API using @vichargame account
var twit = new twitter({
  consumer_key: 'WlX8QJIfRvo6HuIyW2QjZw',
  consumer_secret: 'imhvULLCCBonnBfV8Vv9bz0lZKMMMQo5QLgE2gsaI',
  access_token_key: '901061384-b0T9dTtfwpVE6l0WOHjQbHRrpzqz1D2vFi87j9eI',
  access_token_secret: '8Iz4VcAlbd819rmUkqzMsbmXPM7AtcNPjTRjULZeEXc'
});

//Open WebSocket, on connection from client start streaming tweets which contain "#vichargame"
io.sockets.on('connection', function(socket) {
  twit.stream('statuses/filter', {'track':'#vichargame'},
    function(stream) {
      stream.on('data',function(data){
        socket.emit('twitter',data); //Send tweet data to client when received
      });
    });
});

//Create server to serve out files in "Vi-Char-Splash" directory on port 80
var connect = require('connect');
connect.createServer(
    connect.static('Vi-Char-Splash')
).listen(80,'0.0.0.0');

var twitter = require('ntwitter');
var io = require('socket.io').listen(1337);

var twit = new twitter({
  consumer_key: 'WlX8QJIfRvo6HuIyW2QjZw',
  consumer_secret: 'imhvULLCCBonnBfV8Vv9bz0lZKMMMQo5QLgE2gsaI',
  access_token_key: '901061384-b0T9dTtfwpVE6l0WOHjQbHRrpzqz1D2vFi87j9eI',
  access_token_secret: '8Iz4VcAlbd819rmUkqzMsbmXPM7AtcNPjTRjULZeEXc'
});

io.sockets.on('connection', function(socket) {
  twit.stream('statuses/filter', {'track':'#vichargame'},
    function(stream) {
      stream.on('data',function(data){
        socket.emit('twitter',data);
      });
    });
});

var connect = require('connect');
connect.createServer(
    connect.static('Vi-Char-Splash')
).listen(80,'0.0.0.0');

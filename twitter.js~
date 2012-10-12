var twitter = require('ntwitter');
var io = require('socket.io').listen(1337);

var twit = new twitter({
  consumer_key: 'M5hbNzONxoXbgDUp1VvXNw',
  consumer_secret: '1DM1r47hF8WXvsxPh9j47vnTWH3aO1d2xmJPRGrX8J4',
  access_token_key: '33607297-S40sKUCrR78kEf71FSqjlXqrBbeZDXGKoZIKGCCU',
  access_token_secret: 'C8rImqPjlqeSEq0Hp5anwoXcwQmgRE3uUXq8ePqFk'
});

io.sockets.on('connection', function(socket) {
  twit.stream('statuses/filter', {'track':'#nodejs'},
    function(stream) {
      stream.on('data',function(data){
        socket.emit('twitter',data);
      });
    });
});

var connect = require('connect');
connect.createServer(
    connect.static('Vi-Char-Splash')
).listen(8124,'0.0.0.0');

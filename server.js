var twitter = require('ntwitter');

var twit = new twitter({
  consumer_key: 'M5hbNzONxoXbgDUp1VvXNw',
  consumer_secret: '1DM1r47hF8WXvsxPh9j47vnTWH3aO1d2xmJPRGrX8J4',
  access_token_key: '33607297-S40sKUCrR78kEf71FSqjlXqrBbeZDXGKoZIKGCCU',
  access_token_secret: 'C8rImqPjlqeSEq0Hp5anwoXcwQmgRE3uUXq8ePqFk'
});

twit.search('bieber', {}, function(err, data) {
  console.log(data);
});

var connect = require('connect');
connect.createServer(
    connect.static('Vi-Char-Splash')
).listen(80, '0.0.0.0');

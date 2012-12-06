var twitter = require('ntwitter');
var io = require('socket.io').listen(1337); //WebSocket listening on port 1337
var url = require('url')
var mustache = require('mustache')
var lb = require("./leaderboard.js")
var fs = require("fs")

var leaderboard_template = fs.readFileSync("./templates/leaderboardpage.mustache").toString()

//Open connection to twitter API using @vichargame account
var twit = new twitter({
  consumer_key: 'WlX8QJIfRvo6HuIyW2QjZw',
  consumer_secret: 'imhvULLCCBonnBfV8Vv9bz0lZKMMMQo5QLgE2gsaI',
  access_token_key: '901061384-b0T9dTtfwpVE6l0WOHjQbHRrpzqz1D2vFi87j9eI',
  access_token_secret: '8Iz4VcAlbd819rmUkqzMsbmXPM7AtcNPjTRjULZeEXc'
});

//Open WebSocket, on connection from client start streaming tweets which contain "#vichargame"
//io.sockets.on('connection', function(socket) {});
twit.stream('statuses/filter', {'track':'#vichargame'},
	function(stream) {
		stream.on('data',function(data){
		io.emit('twitter',data); //Send tweet data to client when received
	});
});

//Create server to serve out files in "Vi-Char-Splash" directory on port 80
var connect = require('connect');
connect.createServer( //this will execute all these functions in order
	function(req, res, next) {
		var path = url.parse(req.url, true).pathname //parse the path
		if (path == "/leaderboard.html") { //if we're asking for the leaderboard, go there
			lb.getLeadersHTML(function(err, html) {
				if (err) {
					res.writeHead(500, {'Content-Type' : 'text/plain'})
					res.end(err)
					return
				}
				var page = mustache.render(leaderboard_template, {leaderboard : html})
				res.writeHead(200, {'Content-Type' : 'text/html'})
				res.end(page)
			})
		}
		else next()
	},
    connect.static('Vi-Char-Splash')
).listen(80,'0.0.0.0');

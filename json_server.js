var util = require('util'), url = require('url'), http = require('http'), qs = require('querystring');

//This merges all of the variables in B into A.
//Used for our POST requests to change the gameState object.
var merge = function(a, b) {
	for (var i in b) {
		a[i] = b[i];
	}
	return a;
}
gameState = new Object()
gameState.engine = new Object()

gameState.engine.gameRunning = false
//gameState.engine.lastUpdated = //?
//gameState.engine.timeElapsed = //?

gameState.engine.turrets = new Object()
gameState.engine.turretBullets = new Object()

gameState.engine.fireballs = new Object()
gameState.engine.batteries = new Object()

gameState.engine.player = new Object()
gameState.engine.player.energy = 0
gameState.engine.player.position = new Object()
gameState.engine.player.position.x = 0.0
gameState.engine.player.position.y = 0.0
gameState.engine.player.position.z = 0.0

gameState.engine.eyeballs = new Object()
gameState.engine.platforms = new Object()
gameState.engine.platforms.rows = 0 //get from game group
gameState.engine.platforms.columns = 0 //get from game group
gameState.engine.platforms.deletedTiles = []

gameState.phones = new Object()

gameState.web = new Object()
gameState.web.twitter = new Object()
gameState.web.twitter.activeEffect = "none"
gameState.web.twitter.activeVote = new Object()
gameState.web.twitter.activeVote.isActive = false
gameState.web.twitter.activeVote.hashtags = ""//[#robotBuff,#eyeballBuff]
gameState.web.twitter.activeVote.votes = new Object()
gameState.web.twitter.activeVote.votes.robot = 0
gameState.web.twitter.activeVote.votes.eye = 0


http.createServer(function(req, res) {
	if (req.method == 'POST') {
		var body = '';
		req.on('data', function(data) {
			body += data;
		});
		req.on('end', function() {
			console.log(body);
			try {
				parsed = JSON.parse(body);
			} 
			catch(e) {//error in JSON parsin'
				res.writeHead(400, { //invalid request
					'Content-Type' : 'text/plain'
				});
				res.end("Failed to parse JSON data! We recieved: \n\n"+body);
			}
			res.writeHead(200, { });
			res.end();
			merge(gameState, parsed)
		});
	} else if (req.method == 'GET') {
		res.writeHead(200, {
			'Content-Type' : 'application/json'
		});
		res.end(JSON.stringify(gameState));
	}

}).listen(1730, "0.0.0.0");

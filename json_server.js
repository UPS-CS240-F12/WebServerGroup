var util = require('util'), url = require('url'), http = require('http'), qs = require('querystring');
var sim = require('./simulators.js')

//This merges all of the variables in B into A.
//Used for our POST requests to change the gameState object.
var merge = function(a, b) {
	for (var i in b) {
		if (b[i] === null) delete a[i]
		else a[i] = b[i];
	}
	return a;
}

function initGameState() {
	var gameState = new Object()
	gameState.engine = new Object()

	gameState.engine.gameRunning = false

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
	gameState.web.twitter.activeVote.hashtags = ['#vichargame #robot','#vichargame #eye']
	gameState.web.twitter.activeVote.votes = new Object()
	gameState.web.twitter.activeVote.votes.robot = 0
	gameState.web.twitter.activeVote.votes.eye = 0
	return gameState
}

var mainGameState = initGameState()
var phoneSimState = initGameState()
var gameSimState = initGameState()

http.createServer(function(req, res) {
	var path = url.parse(req.url, true).pathname
	if (path == '/phoneSim.json') { 
		merge(phoneSimState,sim.phoneSim())
		gameState = phoneSimState
	}
	else if (path == '/gameSim.json') {
		merge(gameSimState,sim.gameSim())
		gameState = gameSimState
	}
	else gameState = mainGameState
	var query = url.parse(req.url, true).query
	if (req.method.toUpperCase() === "OPTIONS"){
		res.writeHead(
			"204",
			"No Content",
		{
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, X-PINGOTHER'
		});
		//End the response - we're not sending back any content.
		res.end();
		return;
	};
	if (req.method == 'POST') {
		if (query.phone != undefined && query.score != undefined) {
			var phone = query.phone
			var score = parseInt(query.score)
			console.log("Score is:")
			console.log(score)
			if (gameState.phones[phone] != undefined && !isNaN(score)) {
				if (gameState.phones[phone].score == undefined) {
					gameState.phones[phone].score = 0
				}
				gameState.phones[phone].score += score
				res.writeHead(200, {'Content-Type' : 'application/json'});
				res.write(JSON.stringify(gameState));
				res.end()
				return
			}
			res.writeHead(400, {'Content-Type' : 'text/plain'});
			res.end("Invalid request: "+req.url)
			return
		}
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
			//res.writeHead(200, { });
			//res.end();
			merge(gameState, parsed)
			res.writeHead(200, {
				'Content-Type' : 'application/json'
			});
			res.write(JSON.stringify(gameState));
			res.end();
		});
	} else if (req.method == 'GET') {
		res.writeHead(200, {
			'Content-Type' : 'application/json',
			'Access-Control-Allow-Origin' : '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, X-PINGOTHER'
		});
		res.write(JSON.stringify(gameState));
		res.end();
	}

}).listen(1730, "0.0.0.0");
console.log("Server running.")

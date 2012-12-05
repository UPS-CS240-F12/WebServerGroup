var util = require('util'), url = require('url'), http = require('http'), qs = require('querystring');
var sim = require('./simulators.js')
var twitter = require('ntwitter');
var leaderboard = require("./leaderboard.js")

//Open connection to twitter API using @vichargame account
var twit = new twitter({
  consumer_key: 'WlX8QJIfRvo6HuIyW2QjZw',
  consumer_secret: 'imhvULLCCBonnBfV8Vv9bz0lZKMMMQo5QLgE2gsaI',
  access_token_key: '901061384-b0T9dTtfwpVE6l0WOHjQbHRrpzqz1D2vFi87j9eI',
  access_token_secret: '8Iz4VcAlbd819rmUkqzMsbmXPM7AtcNPjTRjULZeEXc'
});

//This merges all of the variables in B into A.
//Used for our POST requests to change the gameState object.
var merge = function(a, b) {
	for (var i in b) {
		if (b[i] === null) delete a[i]
		else if (typeof a[i] == 'object' && typeof b[i] == 'object') merge(a[i], b[i])
		else a[i] = b[i];
	}
	return a;
}

var voteActive = false;

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
	gameState.web.twitter.activeVote.isActive = voteActive
	gameState.web.twitter.activeVote.hashtags = ['#vichargame #robot','#vichargame #eye']
	gameState.web.twitter.activeVote.votes = new Object()
	gameState.web.twitter.activeVote.votes.robot = 0
	gameState.web.twitter.activeVote.votes.eye = 0
	return gameState
}

var mainGameState = initGameState()
var phoneSimState = initGameState()
var gameSimState = initGameState()

var queryTwitter = function(){
	var curDate = Date.now();
	var roboCount = 0;
	var eyeCount = 0;
	var robotDone = false;
	var eyeDone = false;
	twit.search('#vichargame #robot -RT', {}, function(err, data) {
		robotDone = true;
		var robotTweets = data;
		roboCount = robotTweets.results.length;
		twit.search('#vichargame #eye -RT', {}, function(err, data) {
			eyeDone = true;
			var eyeTweets = data;
			eyeCount = eyeTweets.results.length;
			console.log("Robot tweets as of " + curDate + " : " + roboCount);
			gameState.web.twitter.activeVote.votes.robot = roboCount;
			console.log("Eye tweets as of " + curDate + " : " + eyeCount);
			gameState.web.twitter.activeVote.votes.eye = eyeCount;
			if(roboCount > eyeCount){
				gameState.web.twitter.activeEffect = "robotBuff";
			}else if(roboCount < eyeCount){
				gameState.web.twitter.activeEffect = "eyeballBuff";
			}else{
				gameState.web.twitter.activeEffect = "none";
			}
		});
	});
};

var rockTheVote = function(){
	voteActive = !voteActive;
	gameState.web.twitter.activeVote.isActive = voteActive;
	if(voteActive){
		gameState.web.twitter.activeEffect = "none";
	}
	if(!voteActive){
		setTimeout(queryTwitter, 5000);
	}
};

var voteInterval = setInterval(rockTheVote, 180000); //Toggles a twitter vote every 3 minutes

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
		/**
		 * Scoring API.
		 * 
		 * Processes requests for POST gameState?phone=PHONE&score=SCORE 
		 */
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
		if(query.restartGame != undefined){
			voteActive = false;
			gameStarted = false;
			mainGameState = initGameState();
			clearInterval(voteInterval);
			voteInterval = setInterval(rockTheVote,180000);
			/**
			 * Leaderboard stuff here. 
			 */
            leaderboard.addLeaders(gameState, function(err) {
                if (err) console.log("Error updating leaderboard: " + err)
                else console.log("Leaderboard updated successfully.")
            })
            res.writeHead(204, {})
            res.end()
            return
		}
		/**
		 * General object-modification API. 
		 */
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
			merge(gameState, parsed)
			res.writeHead(200, {
				'Content-Type' : 'application/json'
			});
			res.write(JSON.stringify(gameState));
			res.end();
		});
	} else if (req.method == 'GET') {
	    /**
	     *  GET /leaderboard.json 
	     * 
	     *  Retrieves the overall leaderboard
	     */
	    if (path == "/leaderboard.json") {
	        leaderboard.getLeaders(function (err, leaders) {
	            if (err) {
	                res.writeHead(500, {})
	                res.end("Error retrieving leaderboard.")
	            }
                else {
                    res.writeHead(200, {
                        'Content-Type' : 'application/json',
                        'Access-Control-Allow-Origin' : '*',
                        'Access-Control-Allow-Methods' : 'GET, POST, OPTIONS',
                        'Access-Control-Allow-Headers' : 'Content-Type, X-Requested-With, X-PINGOTHER'
                    });
                    res.write(JSON.stringify(leaders));
                    res.end();
                }

	        })
	    }
	    /**
	     * Everything else is treated as GET /gameState.json 
	     */
		else {
    		res.writeHead(200, {
    			'Content-Type' : 'application/json',
    			'Access-Control-Allow-Origin' : '*',
    			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    			'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With, X-PINGOTHER'
    		});
    		res.write(JSON.stringify(gameState));
    		res.end();
		}
	}

}).listen(1730, "0.0.0.0");
console.log("Server running.")

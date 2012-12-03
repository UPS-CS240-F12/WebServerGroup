var mongodb = require("mongodb"),
	mongoserver = new mongodb.Server("localhost", 27017, {'auto_reconnect' : true}), 
	db_connector = new mongodb.Db("leaderboard", mongoserver, {safe : false}),
	mustache = require("mustache"),
	fs = require("fs")
	
var html_template = fs.readFileSync("./templates/leaderboard.mustache").toString()

var lb_collection



db_connector.open(function(err, db) {
	if (err) {
		console.log("Error connecting to database: " + err)
		console.log("Leaderboard will not function for this session.")
		return
	}
	console.log("Connected to MongoDB!")
	db.createCollection("leaderboard", function(err, collection) {//This will create the collection if it doesn't exist.
		lb_collection = collection
	});
}); 

/**
 * Call this guy to get the current leaders.
 * 
 * @param {Object} callback (err, leaders) returns (err, null) on failure, (null, leaders) on success.
 * Leaders are pretty fresh from the database.
 */
module.exports.getLeaders = function(callback) {
	var cursor = lb_collection.find({});
	cursor.toArray(function(err, documents) {
		if (err) return callback(err, null)
		callback(null, documents)
	})
}

/**
 * Returns an HTML rendering of the current leaderboard.
 * 
 * @param {Object} callback (err, leaders) returns (err, null) on failure, (null, leaders) on success.
 */
module.exports.getLeadersHTML = function(callback) {
	module.exports.getLeaders(function(err, leaders) {
		if (err) return callback(err, null)
		table = mustache.render(html_template, {leaders : leaders})
		callback(null, table)
	})
}


/**
 * Parses the gameState and adds the scores to the DB.
 * Call this once at the end of a game.
 * 
 * Here's some example data I used for testing this function! 
 * state = {engine: {name : "Test Bot", score : 150}, phones: {'test1' : {name : "Test 1", score : 200}, 'test2' : {score : 200}}}
 * 
 * @param {Object} gameState Current state of the game
 * @param {Object} callback Calls back with (error) if there are problems.
 */
module.exports.addLeaders = function(gameState, callback) {
	var scoreList = []
	var phones = gameState.phones
	var keys = Object.keys(phones)
	for( var i = 0; i < keys.length; i++ ) {
		var p_id = keys[i] //phone ID
		var phone = phones[p_id]
		var name = p_id
		if (phone.name) name = phone.name
		var score = 0
		if (phone.score != undefined) score = phone.score
		scoreList.push({type : "phone", phoneid : p_id, name : name, score : score})
	}
	var engine = gameState.engine
	var botScore = 0
	var botName = "Robot Rock"
	if (engine.score) botScore = engine.score
	if (engine.name) botName = engine.name
	scoreList.push({type : "bot", name : botName, score : botScore})
	lb_collection.insert(scoreList, {safe: true}, function(err, records){
		if (err) return callback(err)
		callback(null)
	})
}

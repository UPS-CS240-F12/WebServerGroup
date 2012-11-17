var math = require('math')

var gameSim = {}
gameSim.engine = {}
gameSim.engine.player = {}
gameSim.engine.player.position = {}
gameSim.engine.player.rotation = {'x' : 0.0, 'y' : 0.0, 'z' : 0.0}

var phoneSim = {}
phoneSim.phones = {}

phoneSim.phones.yWVin = {}
phoneSim.phones.yWVin.position = {}
phoneSim.phones.yWVin.position.y = 5.0
phoneSim.phones.yWVin.rotation = {'x' : 0.0, 'y' : 0.0, 'z' : 0.0}

phoneSim.phones.CoiIc = {}
phoneSim.phones.CoiIc.position = {}
phoneSim.phones.CoiIc.position.y = 7.0
phoneSim.phones.CoiIc.rotation = {'x' : 0.0, 'y' : 0.0, 'z' : 0.0}

module.exports.phoneSim = function () {
	var localTime = Date.now() % 300000 //cycle everything every 5 minutes
	phoneSim.phones.yWVin.lastUpdated = Date.now()
	phoneSim.phones.CoiIc.lastUpdated = Date.now()
	var rotationFrac = (localTime % 30000) / 30000 //how far are we through a 30 second cycle? 
	var x = math.sin(rotationFrac)
	var z = math.cos(rotationFrac)
	phoneSim.phones.CoiIc.position.x = x * 10.0
	phoneSim.phones.CoiIc.position.z = z * 10.0
	phoneSim.phones.yWVin.position.x = x * -8.0
	phoneSim.phones.yWVin.position.z = z * -8.0
	return phoneSim
}

module.exports.gameSim = function () {
	var localTime = Date.now() % 300000 //cycle everything every 5 minutes
	gameSim.lastUpdated = Date.now()
	gameSim.timeElapsed = localTime
	var rotationFrac = (localTime % 30000) / 30000 //how far are we through a 30 second cycle? 
	var x = math.sin(rotationFrac)
	var z = math.cos(rotationFrac)
	gameSim.engine.player.position.x = x * 10.0
	gameSim.engine.player.position.z = z * 10.0
	return gameSim
}
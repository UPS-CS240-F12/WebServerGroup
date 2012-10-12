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
gameState.message = "Hello JSON"

http.createServer(function(req, res) {
	if (req.method == 'POST') {
		var body = '';
		req.on('data', function(data) {
			body += data;
		});
		req.on('end', function() {
			console.log(body);
			res.writeHead(200, { });
			//This should be modified to return 200 on success and something else on failure.
			res.end();
			merge(gameState, JSON.parse(body))
		});
	} else if (req.method == 'GET') {
		res.writeHead(200, {
			'Content-Type' : 'application/json'
		});
		res.end(JSON.stringify(gameState));
	}

}).listen(1730, "0.0.0.0");

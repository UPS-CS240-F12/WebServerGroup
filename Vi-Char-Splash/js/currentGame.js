(function($) {

	var eyeCount = 0;
	var robotCount  = 0;
	var rtv = true;

	//var http = require('http');
	//var options = {
  	//	host: 'www.puppetmaster.pugetsound.edu:1730',
 	//	 path: '/gameState.json'
	//};

	//http.get(options, function(res) {
  	//console.log('STATUS: ' + res.statusCode);
  	//console.log('HEADERS: ' + JSON.stringify(res.headers));
	//}).on('error', function(e) {
 	// console.log('ERROR: ' + e.message);
	//});

	var getKeys = function(obj){
		var keys = [];
		for(var key in obj){
			keys.push(key);
		}
		return keys;
	};
	
	var updatePage = function(){
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "http://puppetmaster.pugetsound.edu:1730/gameState.json"
		}).done(function(data){
			console.log("Fetched the gameState data!");
			//Update robot energy if needed
			var newRoboEnergy = data.engine.player.energy;
			var oldRoboEnergy = $("#robotEn").val();
			if(newRoboEnergy != oldRoboEnergy){
				$("#robotEn").val(newRoboEnergy);
			}
			
			//Update list of phones if needed
			var phoneKeys = getKeys(data.phones);
			$("#phoneList").empty();
			$.each(phoneKeys, function(index, value) { 
				$("#phoneList").append("<p>" + value + "</p>");
			});

			//Toggle vote section
			var voteActive = data.web.twitter.activeVote.isActive;
			if(voteActive){
				$("#voteSection").show();
			}else{
				$("#voteSection").hide();
			}
		});
	};

	$(document).ready(function() {
	
		//JSON test
		setInterval(updatePage,3000);

		//var $container = $('ul.tweets'),
			//var socket = io.connect('http://10.150.2.55:1337');
			//template = $('#tweetTemplate');
			var tweets = io.connect('http://puppetmaster.pugetsound.edu:1337');
			//var turret = io.connect('http://localhost:1234');
			
		/*turret.on('turretData', function(data) {
			alert(data);
		});*/
 
	    tweets.on('twitter', function(data) {

		var rCount = document.getElementById("robotCount");
		var eCount = document.getElementById("eyeCount");

	        //$container.append(template.render(data));
			//alert(data.text);
		if(rtv == true){
			if(data.text.indexOf("#robot") != -1){

				robotCount = robotCount +1;
				
				rCount.innerHTML = "Count: " + robotCount;

				$('.vote.robot .target').append('<span class="tweet" style="display:none;"><p class="tweet-txt">' + data.text + '</p><p class="tweet-attr">@' + data.user.screen_name + ', ' + data.created_at + '</p></span>');
				$('.vote.robot .target').find('.tweet:last').slideDown();
			}
			else if(data.text.indexOf("#eye") != -1){

				eyeCount = eyeCount +1;
				
				eCount.innerHTML = "Count: " + eyeCount;

				$('.vote.eye .target').append('<span class="tweet" style="display:none;"><p class="tweet-txt">' + data.text + '</p><p class="tweet-attr">@' + data.user.screen_name + ', ' + data.created_at + '</p></span>');
				$('.vote.eye .target').find('.tweet:last').slideDown();
			}
			else{
				//Do nothing
			}
		}
	    });
$('.button.rtv').click(function() {

			var rCount = document.getElementById("robotCount");
			var eCount = document.getElementById("eyeCount");			
			
			robotCount = 0;
			eyeCount = 0;

			rCount.innerHTML = "";
			eCount.innerHTML = "";

			$('.vote .target').empty();
			$('.vote').toggle();
			
		});
	});
})(jQuery);

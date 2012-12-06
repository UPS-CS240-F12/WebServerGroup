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
		
		//Show/hide current game state, and update if needed
		var gameActive = data.engine.gameRunning;
		if(gameActive){
			if(!$("#gameActive").is(":visible")){
				$("#gameActive").show();
				$("#gameInactive").hide();
			}
			//Update robot energy if needed
			var newRoboEnergy = data.engine.player.energy;
			var oldRoboEnergy = $("#robotEn").val();
			if(newRoboEnergy != oldRoboEnergy){
				$("#robotEn").val(newRoboEnergy);
			}
			//Update list of phones if needed
			var phones = data.phones;
			$("#phoneList").empty();
			$.each(phones, function(i, val) {
				if(val.screenName != undefined){
					$("#phoneList").append("<p id='" + i + "'>" + val.screenName + "</p>");
				}
				else{
					$("#phoneList").append("<p id='" + i + "'>" + i + "</p>");
				}
			});
			//Toggle vote section
			var voteActive = data.web.twitter.activeVote.isActive;
			var newBuff = data.web.twitter.activeEffect;
			var curBuff = $("#curBuff").text();
			if(curBuff != newBuff){
				$("#curBuff").text(newBuff);
			}
			if(voteActive){
				$(".vote").show();
			}else{
				$(".vote").hide();
			}
		}
		else{
			//Game is inactive, hide current game stats if needed
			if(!$("#gameInactive").is(":visible")){
				$("#gameActive").hide();
				$("#gameInactive").show();
			}
		}
	});
};

$(document).ready(function() {

	//Update the page once it has loaded
	updatePage();

	//Fetch the current game's state every 3 seconds
	setInterval(updatePage,3000);

});
(function($) {
	$(document).ready(function() {
		//var $container = $('ul.tweets'),
			//var socket = io.connect('http://10.150.2.55:1337');
			//template = $('#tweetTemplate');
			var tweets = io.connect('http://localhost:1337');
			//var turret = io.connect('http://localhost:1234');
			
		/*turret.on('turretData', function(data) {
			alert(data);
		});*/
 
	    tweets.on('twitter', function(data) {
	        //$container.append(template.render(data));
			//alert(data.text);
			if(data.text.indexOf("#robot") != -1){
				$('.vote.robot .target').append('<span class="tweet" style="display:none;"><p class="tweet-txt">' + data.text + '</p><p class="tweet-attr">@' + data.user.screen_name + ', ' + data.created_at + '</p></span>');
				$('.vote.robot .target').find('.tweet:last').slideDown();
			}
			else if(data.text.indexOf("#eye") != -1){
				$('.vote.eye .target').append('<span class="tweet" style="display:none;"><p class="tweet-txt">' + data.text + '</p><p class="tweet-attr">@' + data.user.screen_name + ', ' + data.created_at + '</p></span>');
				$('.vote.eye .target').find('.tweet:last').slideDown();
			}
			else{
				//Do nothing
			}
	    });
$('.button.rtv').click(function() {
			$('.vote .target').empty();
			$('.vote').toggle();
		});
	});
})(jQuery);

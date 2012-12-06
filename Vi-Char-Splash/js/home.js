(function($) {
	$(document).ready(function() {
		//var $container = $('ul.tweets'),
			var socket = io.connect('http://10.150.2.55:1337');
			//template = $('#tweetTemplate');
			
 
	    socket.on('twitter', function(data) {
	        //$container.append(template.render(data));
			//alert(data.text);
			console.log(data.results.length);
			/*if($('.tweet').length == 3){
				$('.tweet').first().slideUp().remove();
				$('.tweets').append('<span class="tweet" style="display:none;"><p>' + data.text + '</p><p class="tweet-attr">@' + data.user.screen_name + ', ' + data.created_at + '</p></span>');
				$('.tweets').find('.tweet:last').slideDown();
			}
			else{
				$('.tweets').append('<span class="tweet" style="display:none;"><p>' + data.text + '</p><p class="tweet-attr">@' + data.user.screen_name + ', ' + data.created_at + '</p></span>');
				$('.tweets').find('.tweet:last').slideDown();
			}*/
	    });
	});
})(jQuery);

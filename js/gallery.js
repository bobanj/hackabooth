var currentPhotoUris = [];
function showPhotosCollage (photoUris) {
	for (var i = 0; i < photoUris.length; i++) {
		var img = $('<img>', { class: 'photo', src: "http://yelp-mpesce.local:8080" + photoUris[i] });
		img.css({
			"box-shadow" : "4px 4px 16px 0px #333333"
		})
		$('.photos').prepend(img);
		if(!currentPhotoUris) {
			currentPhotoUris = []
		}
		currentPhotoUris.push(photoUris[i])
	}
	$('.photos').collagePlus();
}

var z = 0;
function showPhotosPile (photoUris) {
	for (var i = 0; i < photoUris.length; i++) {
		var img = $('<img>', { class: 'photo', src: "http://yelp-mpesce.local:8080" + photoUris[i] });

		var angle = Math.random() * Math.PI/2 - Math.PI/4;

		var x = (Math.random() * 640);
		var y = (Math.random() * 128);

		var targetX = x + Math.cos(angle) * 32;
		var targetY = y + Math.sin(angle) * 32;


		img.css({
			"opacity" : 0,
			"-webkit-transform" : "rotate(" + angle * (180/Math.PI) + "deg)",
			"marginTop" : x +  "px",
			"marginLeft" : y + "px",
			"position" : "absolute",
			"box-shadow" : "32px 32px 100px 0px #000000",
			"z-index" : z
		});
		img.animate(
			{
				"opacity" : 1,
				"marginTop" : targetY,
				"marginLeft" : targetX,
				"box-shadow" : "3px 3px 5px 0px #333333"
			},
			1000
		)
		$('.photos').append(img);
		z++;
	}
}

function getRecentPhotos() {
	$.ajax({
		url : "http://yelp-mpesce.local:8080/recent_images",
		type : "GET",
		crossDomain: true,
		success : processPhotos
	});
}

function processPhotos(responsePhotoUris) {
	var newPhotoUris = responsePhotoUris.filter(function(i) {return currentPhotoUris.indexOf(i) < 0;});
	showPhotosCollage(newPhotoUris)
}

$( document ).ready(function() {
	//setInterval( function() { showPhotos(["http://placehold.it/" + Math.round(Math.random() * 480) + "x" + Math.round(Math.random() * 480)]) } , 2000);
	setInterval(getRecentPhotos, 5000)
});
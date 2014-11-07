var currentPhotoUris = [];
var SERVER_URL = "http://hackabooth.jovanoski.net:8080";
var imgId = 0;

// TODO clean up / refactor

function showPhotosCollage (photoUris) {
	$(".photo").each(function() {
		if($(this).data("clicked") === false) {
			$(this).attr("src", $(this).data("uri"))
		}
	})
	for (var i = 0; i < photoUris.length; i++) {
		if(i > 3){
            // Do not load all images at once
            return false;
        }
        var img = $('<img>', { id: imgId, class: 'photo', src: SERVER_URL + photoUris[i] });
		imgId++;

		img.data("uri", SERVER_URL + photoUris[i])
		img.data("clicked", false)
		if(i === photoUris.length - 1) {
			img.attr("src", img.data("uri") + "&grid=1")
		}

		img.css({
			"box-shadow" : "2px 2px 8px 0px #333333"
		})

		$('.photos').prepend(img);
		if(!currentPhotoUris) {
			currentPhotoUris = []
		}

		img.on("click", function() {
			console.log(img.data("clicked"))
			if($(this).attr("src").indexOf("grid") < 0) {
				$(this).attr("src", $(this).data("uri") + "&grid=1")
			} else {
				$(this).attr("src", $(this).data("uri"))
			}
			img.data("clicked", true)
			console.log(img.data("clicked"))
			console.log($(this).attr("src"))
			$('.photos').collagePlus();
		})

		currentPhotoUris.push(photoUris[i])
	}
	$('.photos').collagePlus();
}

var z = 0;
function showPhotosPile (photoUris) {
	for (var i = 0; i < photoUris.length; i++) {
		var img = $('<img>', { class: 'photo', src: SERVER_URL + photoUris[i] });

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
		url : SERVER_URL + "/recent_images",
		type : "GET",
		crossDomain: true,
		success : processPhotos
	});
}

function processPhotos(responsePhotoUris) {
	if(currentPhotoUris.length == 0) {
		//New page! Dirty hack to order pictures!
		responsePhotoUris = responsePhotoUris.reverse();
	}
	var newPhotoUris = responsePhotoUris.filter(function(i) {return currentPhotoUris.indexOf(i) < 0;});
	if(newPhotoUris.length > 0) {
		showPhotosCollage(newPhotoUris)
	}
}

$( document ).ready(function() {
	//setInterval( function() { showPhotos(["http://placehold.it/" + Math.round(Math.random() * 480) + "x" + Math.round(Math.random() * 480)]) } , 2000);
	getRecentPhotos();
	setInterval(getRecentPhotos, 5000);
});
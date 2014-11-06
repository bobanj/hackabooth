$( document ).ready(function() {
	Webcam.set({
		// live preview size
		width: 320,
		height: 240,
		
		// device capture size
		dest_width: 640,
		dest_height: 480,
		
		// final cropped size
		crop_width: 480,
		crop_height: 480,
		
		// format and quality
		image_format: 'jpeg',
		jpeg_quality: 90
	});
	Webcam.attach('#camera');
});

var countdownTimer;
var countdownInterval;
var countdown = 5;
var captureInterval;
var photoUris = [];

function capture() {
	Webcam.snap( function(dataUri) {
		photoUris.push(dataUri);
	} );

	if(photoUris.length >= 4) {
		//All done!
		clearInterval(captureInterval);
		showPhotos();
	}
}

function startCapture() {
	photoUris = []
	captureInterval = setInterval(capture, 1000);

	clearInterval(countdownInterval);
}

function startCountdown() {
	countdown = 0;
	countdownTimer = setTimeout(startCapture, countdown*1000);
	countdownInterval = setInterval(updateCountdown, 1000);

	updateCountdownHtml(countdown);
}

function updateCountdown() {
	if(countdown > 0) {
		countdown--;
	}
	updateCountdownHtml(countdown);
}

function updateCountdownHtml(countdown) {
	$("#countdown").text(countdown)
}

function showPhotos() {
	for (var i = 0; i < photoUris.length; i++) {
		$('#results').append($('<img>', {id: 'img'+i, 'class':'preview', src: photoUris[i], width:'320px', height:'320px'}))
	}
}

function receivePhoto(data) {
	var imageUrl = data['url']
	console.log("http://yelp-mpesce.local:8080" + imageUrl)
}

function sendPhotos() {
	$.ajax({
		url : "http://yelp-mpesce.local:8080/save_images",
		data : {
			"image_1" : photoUris[0],
			"image_2" : photoUris[1],
			"image_3" : photoUris[2],
			"image_4" : photoUris[3]
		},
		type : "POST",
		crossDomain: true,
		success : receivePhoto
	});
}

function getPhotos() {

}
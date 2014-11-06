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
var captureInterval;
var photoUris = [];

function addPhoto() {
	Webcam.snap( function(dataUri) {
		photoUris.push(dataUri);
		Webcam.freeze();
		setTimeout(Webcam.unfreeze, 200)
	} );

	if(photoUris.length >= 4) {
		clearInterval(captureInterval);
		handlePhotos();
	}
}

function startCapture() {
	captureInterval = setInterval(addPhoto, 1000);
}

function startCountdown() {
	countdownTimer = setTimeout(startCapture, 3000);
	countdownInterval = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
	
}

function handlePhotos() {
	for (var i = 0; i < photoUris.length; i++) {
		$('#results').append($('<img>', {id: 'img'+i ,src: photoUris[i] }))
	}
	console.log(photoUris[0].substring(22).substring(0, 20))
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
		crossDomain: true
	});
}
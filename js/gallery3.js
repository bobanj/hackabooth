$( document ).ready(function() {
    var SERVER_URL = "http://hackabooth.jovanoski.net:8080";
    var currentPhotoUris = [];
    var container = $('body');
    var containerW = container.outerWidth();
    var containerH = container.outerHeight();
    var containerDiagonal = Math.sqrt(containerW * containerW + containerH * containerH);
    var centerX = containerW / 2;
    var centerY = containerH / 2;


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var getRandomCoordinates = function(photoRadius){
        var randX = getRandomInt(photoRadius, containerW - photoRadius);
        var randY = getRandomInt(photoRadius, containerH - photoRadius);
        return [randX, randY];
    };

    var calculateRadius = function(photo){
        var photoW = 100;//photo.width();
        var photoH = 150;//photo.height();
        return Math.sqrt((photoW * photoW) + (photoH * photoH)) / 2;
    };

    var generatePhotoHtml = function(photoUrl){
        var photoUrl = SERVER_URL + photoUrl;
        var gridPhotoUrl = photoUrl + '&grid=1';
        var photoHTML = [
            '<a class="" href="', gridPhotoUrl,'">',
                '<img class="img-responsive" src="', gridPhotoUrl, '" alt="">',
            '</a>'
        ];
        return photoHTML.join('');
    };

    function getRecentPhotos() {
        $.ajax({
            url : SERVER_URL + "/recent_images",
            type : "GET",
            crossDomain: true,
            success : processPhotos
        });
    };

    var scaleVector = function(vector, value){
        return [vector[0] * value, vector[1] * value];
    };

    var substractVectors = function(vectorA, vectorB){
        return [vectorA[0] - vectorB[0], vectorA[1] - vectorB[1]];
    };

    var addVectors = function(vectorA, vectorB){
        return [vectorA[0] + vectorB[0], vectorA[1] + vectorB[1]];
    };

    function processPhotos(responsePhotoUris) {
        var newPhotoUris = responsePhotoUris.filter(function(i) {return currentPhotoUris.indexOf(i) < 0;});
        if(newPhotoUris.length > 0) {
            $.each(newPhotoUris, function(i, photoUrl){
                if (i == 0){
                    var photoHtml = generatePhotoHtml(photoUrl);
                    var photo = $(photoHtml);
                    var photoRadius = calculateRadius(photo);
                    var endPoint = getRandomCoordinates(photoRadius);
                    var vector = [endPoint[0] - centerX, endPoint[1] - centerY];
                    var vectorLength = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
                    var unityVector = scaleVector(vector, 1 / vectorLength);
                    var startPointVector = scaleVector(unityVector, containerDiagonal);
                    var animationVector = substractVectors(startPointVector, endPoint);
                    var photoStartPoint = addVectors(startPointVector, [centerX, centerY]);

                    photo.css({position: 'absolute', 'visibility': 'hidden', width: 150, height: 150});
                    container.append(photo);
                    photo.css({position: 'absolute', 'left': photoStartPoint[0], 'top': photoStartPoint[1], 'visibility': 'visible'});
                    photo.animate({ "left": animationVector[0], "top": animationVector[1]}, 4000 );
                    currentPhotoUris.push(photoUrl);
                }
            });
        }
    }

    getRecentPhotos();
    setInterval(getRecentPhotos, 5000);
});
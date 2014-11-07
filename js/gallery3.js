$( document ).ready(function() {
    var SERVER_URL = "http://hackabooth.jovanoski.net:8080";
    var currentPhotoUris = [];
    var container = $('.container');
    var containerX = container.outerWidth();
    var containerY = container.outerHeight();
    var centerX = $(windows).outerWidth() / 2;
    var centerY = $(windows).outerHeight() / 2;

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var getRandomCoordinates = function(){

    };

    var generatePhotoHtml = function(photoUrl){
        var photoUrl = SERVER_URL + photoUrl;
        var gridPhotoUrl = photoUrl + '&grid=1';
        var photoHTML = [
            '<a class="thumbnail" href="', gridPhotoUrl,'">',
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

    function processPhotos(responsePhotoUris) {
        var newPhotoUris = responsePhotoUris.filter(function(i) {return currentPhotoUris.indexOf(i) < 0;});
        if(newPhotoUris.length > 0) {
            $.each(newPhotoUris, function(i, photoUrl){
                if (i < 3){
                    var photoHtml = generatePhotoHtml(photoUrl);
                    row.append(photoHtml);
                    currentPhotoUris.push(photoUrl);
                }
            });
        }
    }

    getRecentPhotos();
    setInterval(getRecentPhotos, 5000);
});
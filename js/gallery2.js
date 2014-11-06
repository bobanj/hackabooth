$( document ).ready(function() {
    var SERVER_URL = "http://hackabooth.jovanoski.net:8080";
    var currentPhotoUris = [];
    var row = $('.row');

    var generatePhotoHtml = function(photoUrl){
        var photoUrl = SERVER_URL + photoUrl;
        var gridPhotoUrl = photoUrl + '&grid=1';
        var photoHTML = [
            '<div class="col-lg-3 col-md-4 col-xs-6 thumb">',
                '<a class="thumbnail" href="', gridPhotoUrl, '">',
                    '<img class="img-responsive" src="', photoUrl, '" alt="">',
                '</a>',
          '</div>'
        ];
        row.append($(photoHTML.join('')));

    };
    function getRecentPhotos() {
        $.ajax({
            url : SERVER_URL + "/recent_images",
            type : "GET",
            crossDomain: true,
            success : processPhotos
        });
    }

    function processPhotos(responsePhotoUris) {
        var newPhotoUris = responsePhotoUris.filter(function(i) {return currentPhotoUris.indexOf(i) < 0;});
        if(newPhotoUris.length > 0) {
            $.each(newPhotoUris, function(i, photoUrl){
                row.append(generatePhotoHtml(photoUrl));
            });
        }
    }

    getRecentPhotos();
});
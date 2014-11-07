$( document ).ready(function() {
    var SERVER_URL = "http://hackabooth.jovanoski.net:8080";
    var currentPhotoUris = [];
    var row = $('.row');

    var generatePhotoHtml = function(photoUrl){
        var photoUrl = SERVER_URL + photoUrl;
        var gridPhotoUrl = photoUrl + '&grid=1';
        var photoHTML = [
            '<div class="col-lg-3 col-md-4 col-xs-6 thumb">',
                '<a class="thumbnail" href="', gridPhotoUrl, '" data-lightbox="image">',
                    '<img class="img-responsive" src="', gridPhotoUrl, '" alt="">',
                '</a>',
          '</div>'
        ];
        return photoHTML.join('');
    };

    function getRecentPhotos() {
        console.log("getting stuff");
        $.ajax({
            url : SERVER_URL + "/gallery_images?limit=2000",
            type : "GET",
            crossDomain: true,
            success : processPhotos,
            error: function(){
                var timeout = setTimeout(function(){
                    getRecentPhotos();
                    clearTimeout(timeout);
                }, 5000);
            }
        });
    };


    function processPhotos(responsePhotoUris) {
        var newPhotoUris = responsePhotoUris.filter(function(i) {return currentPhotoUris.indexOf(i) < 0;});
        if(newPhotoUris.length > 0) {
            $.each(newPhotoUris, function(i, photoUrl){
                var photoHtml = generatePhotoHtml(photoUrl);
                row.prepend(photoHtml);
                currentPhotoUris.push(photoUrl);
            });
            var mostRecentPhoto = row.find("a:first");
            if (mostRecentPhoto.length){
                mostRecentPhoto.click();
            }
        }
        var timeout = setTimeout(function(){
            getRecentPhotos();
            clearTimeout(timeout);
        }, 5000);
    }

    getRecentPhotos();
});
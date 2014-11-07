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
        $.ajax({
            url : SERVER_URL + "/recent_images",
            type : "GET",
            crossDomain: true,
            success : processPhotos
        });
    };

//    function getRandomInt(min, max) {
//        return Math.floor(Math.random() * (max - min + 1)) + min;
//    };

    function processPhotos(responsePhotoUris) {
        var newPhotoUris = responsePhotoUris.filter(function(i) {return currentPhotoUris.indexOf(i) < 0;});
        if(newPhotoUris.length > 0) {
            $.each(newPhotoUris, function(i, photoUrl){
                if (i < 3){
                    var photoHtml = generatePhotoHtml(photoUrl);
                    row.prepend(photoHtml);
                    currentPhotoUris.push(photoUrl);
                }
            });
            row.find("a:first").click();
        }
    }
//    var swapThumbnailData = function(link){
//        var image = link.children("img");
//        var pom = image.attr("src");
//
//        image.attr("src", link.attr("href"));
//        link.attr("href", pom);
//    };
//    $('.container').on('click', '.thumbnail', function(e){
//        e.preventDefault();
//        var link = $(this);
//        if(!link.hasClass("grid")){
//            swapThumbnailData(link);
//            link.addClass("grid");
//        }
//    });
//
//    $('.container').on('click', '.grid', function(e){
//        e.preventDefault();
//        var link = $(this);
//        swapThumbnailData(link);
//        link.removeClass("grid");
//    });

    getRecentPhotos();
    //TODO kill setInterval
    setInterval(getRecentPhotos, 5000);
});
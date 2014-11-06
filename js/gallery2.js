$( document ).ready(function() {
    var SERVER_URL = "http://boban.jovanoski.net:8080";
    var currentPhotoUris = [];

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
           debugger;
        }
    }

    getRecentPhotos();
});
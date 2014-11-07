$(document).ready(function () {

    var COUNTDOWN_SECONDS = 3;
    var SERVER_URL = "http://hackabooth.jovanoski.net:8080";
    var curtainopen = false;
    var flash = $(".flash");
    var rope = $('.rope');
    var countdown = $('.countdown');
    var inProgress = false;
    var photoUris = [];
    var shutter = new Audio();
    var clock = new FlipClock(countdown, COUNTDOWN_SECONDS, {
        clockFace: 'Counter',
        minimumDigits: 1,
        countdown: true,
        autoStart: false,
        callbacks: {
            stop: function () {
                countdown.trigger('countdown:finished');
            }
        }
    });
    shutter.autoplay = false;
    shutter.src = navigator.userAgent.match(/Firefox/) ? 'audio/shutter.ogg' : 'audio/camera.mp3';


    countdown.on('photo:taken', function () {
        if (photoUris.length >= 4) {
            inProgress = false;
            toggleCurtains();
            sendPhotos(photoUris);
            photoUris = [];
        } else {
            var photoTimeout = setTimeout(function () {
                startCountdown();
                clearTimeout(photoTimeout);
            }, 1000)
        }
    });

    countdown.on('countdown:finished', function () {
        //countdown.hide();
        takePhoto();
    });

    var sendPhotos = function(photoUris) {
        $.ajax({
            url : SERVER_URL + "/save_images",
            data : {
                "image_1" : photoUris[0],
                "image_2" : photoUris[1],
                "image_3" : photoUris[2],
                "image_4" : photoUris[3]
            },
            type : "POST",
            crossDomain: true,
            success : function(data) {
                showPreview(data)
            },
            error : function(data) {
                console.log(data);
            }
        });
    };

    var showPreview = function(response) {
        console.log(response)
        $(".greeting img").attr("src", SERVER_URL + response['url'] + "&grid=1");
    }

    var takePhoto = function () {
        shutter.load();
        shutter.play();

        Webcam.snap(function (dataUri) {
            photoUris.push(dataUri);
        });
        flash.show().animate({opacity: 0.5}, 300).fadeOut(300);
        countdown.trigger('photo:taken');
    };

    var setClock = function(){
        var clockTimeout = setTimeout(function () {
            if (clock.getTime().time == 0) {
                clock.stop();
            } else {
                clock.decrement();
                setClock();
            }
            clearTimeout(clockTimeout);
        }, 1000);
    };

    var startCountdown = function () {
        clock.setValue(COUNTDOWN_SECONDS);
        setClock();
    };

    var curtainsOpened = function () {
        inProgress = true;
        startCountdown();
    };

    var setCamera = function () {
        Webcam.set({
            // live preview size
            width: 640,
            height: 480,

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
    };

    var showGreeting = function() {
        $(".greeting").css({ "opacity" : 1 });
        var timeout = setTimeout(hideGreeting, 5000);
    }

    var hideGreeting = function() {
        $(".greeting").css({ "opacity" : 0 });
    }

    var toggleCurtains = function () {
        if (inProgress) {
            return false;
        }
        if (curtainopen == false) {
            clock.setValue(COUNTDOWN_SECONDS);
            rope.stop().animate({top: '0px'}, {queue: false, duration: 350, easing: 'easeOutBounce'});
            $(".leftcurtain").stop().animate({width: '240px'}, 2000);
            $(".rightcurtain").stop().animate({width: '240px'}, 2000, curtainsOpened);
            hideGreeting();
            curtainopen = true;
        } else {
            rope.stop().animate({top: '-40px'}, {queue: false, duration: 350, easing: 'easeOutBounce'});
            $(".leftcurtain").stop().animate({width: '50%'}, 2000);
            $(".rightcurtain").stop().animate({width: '51%'}, 2000);
            showGreeting();
            curtainopen = false;
        }
    };

    rope.click(function (e) {
        e.preventDefault();
        $(this).blur();
        toggleCurtains();
        return false;
    });

    $('body').keyup(function (e) {
        if (e.keyCode == 32) {
            rope.click();
        }
    });

    setCamera();
    flash.hide();

    $("#countdown").click(function (e) {
        e.preventDefault();
        clock.start();
    });
});

$(document).ready(function () {

    var curtainopen = false;
    var rope = $('.rope');
    var countdown = $('.countdown');
    var inProgress = false;
    var photoUris = [];
    var shutter = new Audio();
    var clock = new FlipClock(countdown, 3, {
        clockFace: 'Counter',
        minimumDigits: 1,
        countdown: true,
        autoStart: false,
        callbacks: {
            stop: function () {
                console.log("STOP THAT SHIT!");
                countdown.trigger('countdown:finished');
            }
        }
    });

    shutter.autoplay = false;
    shutter.src = navigator.userAgent.match(/Firefox/) ? 'audio/shutter.ogg' : 'audio/shutter.mp3';


    countdown.on('photo:taken', function () {
        if (photoUris.length >= 4) {
            inProgress = false;
            toggleCurtains();
            console.log("ALL PHOTOS TAKEN!! ", photoUris);
            photoUris = [];
        } else {
            console.log("Start COUNTDOWN!!!");
            var photoTimeout = setTimeout(function () {
                console.log("PHOTO TAKEN, START COUNTDOWN");
                startCountdown();
                clearTimeout(photoTimeout);
            }, 1000)
        }
    });

    countdown.on('countdown:finished', function () {
        //countdown.hide();
        takePhoto();
    });

    var takePhoto = function () {
        shutter.load();
        shutter.play();
        Webcam.snap(function (dataUri) {
            photoUris.push(dataUri);
        });
        countdown.trigger('photo:taken');
    };

    var setClock = function(){
        var clockTimeout = setTimeout(function () {
            clock.decrement();
            if (clock.getTime().time == 0) {
                clock.stop();
            } else {
                setClock();
            }
            clearTimeout(clockTimeout);
        }, 1000);
    };

    var startCountdown = function () {
        clock.setValue(3);
        setClock();
    };

    var curtainsOpened = function () {
        console.log("CURTAINS OPEN, START COUNTDOWN!!!");
        inProgress = true;
        startCountdown();
    };

    var setCamera = function () {
        Webcam.set({
            // live preview size
            //width: 800,
            //height: 600,


            // final cropped size
            crop_width: 640,
            crop_height: 640,

            // format and quality
            image_format: 'jpeg',
            jpeg_quality: 90
        });
        Webcam.attach('#camera');
    };

    var toggleCurtains = function () {
        if (inProgress) {
            return false;
        }
        if (curtainopen == false) {
            clock.setValue(3);
            rope.stop().animate({top: '0px'}, {queue: false, duration: 350, easing: 'easeOutBounce'});
            $(".leftcurtain").stop().animate({width: '240px'}, 2000);
            $(".rightcurtain").stop().animate({width: '240px'}, 2000, curtainsOpened);
            curtainopen = true;
        } else {
            rope.stop().animate({top: '-40px'}, {queue: false, duration: 350, easing: 'easeOutBounce'});
            $(".leftcurtain").stop().animate({width: '50%'}, 2000);
            $(".rightcurtain").stop().animate({width: '51%'}, 2000);
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

    $("#countdown").click(function (e) {
        e.preventDefault();
        clock.start();
    });
});
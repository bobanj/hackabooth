$(document).ready(function() {

    var curtainopen = false;
    var rope = $('.rope');

    var setCamera = function(){
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

    var toggleCurtains = function(){
        if (curtainopen == false){
            $(this).stop().animate({top: '0px' }, {queue:false, duration:350, easing:'easeOutBounce'});
            $(".leftcurtain").stop().animate({width:'240px'}, 2000 );
            $(".rightcurtain").stop().animate({width:'240px'},2000 );
            curtainopen = true;
        }else{
            $(this).stop().animate({top: '-40px' }, {queue:false, duration:350, easing:'easeOutBounce'});
            $(".leftcurtain").stop().animate({width:'50%'}, 2000 );
            $(".rightcurtain").stop().animate({width:'51%'}, 2000 );
            curtainopen = false;
        }
    };

    rope.click(function(e){
        e.preventDefault();
        $(this).blur();
        toggleCurtains();
        return false;
    });

    $('body').keyup(function(e){
        if(e.keyCode == 32){
            rope.click();
        }
    });

    setCamera();

});
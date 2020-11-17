function AudioController () {
    var audioElement = $('#audio')[0];
    var fileSrc = '';

    $(audioElement).bind('ended', function(){
        // done playing
        $.event.trigger({
            type: "audioStopped"
        });
    });
    

    function setAudioSrc (src) {
        fileSrc = src;
        audioElement.setAttribute('src', fileSrc);
    }

    function playAudio (src, withPause) {
        if (typeof(withPause) === 'undefined') withPause = true;

        if (src) {
            setAudioSrc(src);
        } 
        
        if (withPause) {
            // add a slight pause before each audio so it's not rushed
            setTimeout(function () { audioElement.play() }, 2000);
        } else {
            audioElement.play();
        }
    };

    function pauseAudio () {
        audioElement.pause();
    };

    function stopAudio () {
        audioElement.stop();
    };

    return {
        setAudioSource: setAudioSrc,
        play: playAudio,
        pause: pauseAudio,
        stop: stopAudio
    }
};

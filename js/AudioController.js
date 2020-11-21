function AudioController () {
    var audioElement = $('#audio')[0];
    var fileSrc = '';

    $(audioElement).bind('ended', function(){
        // done playing
        fileSrc = '';

        // $.event.trigger({
        //     type: "audioStopped"
        // });
    });
    

    function setAudioSrc (src) {
        fileSrc = src;
        audioElement.setAttribute('src', fileSrc);
    }

    function playAudioPromise () {
        var playPromise = audioElement.play();

        // In browsers that don’t yet support this functionality,
        // playPromise won’t be defined.
        if (playPromise !== undefined) {
          playPromise.then(function() {
            // Automatic playback started!
          }).catch(function(error) {
            // Automatic playback failed.
            // Show a UI element to let the user manually start playback.
          });
        }
    };

    function playAudio (src, withPause) {
        if (typeof(withPause) === 'undefined') withPause = false;

        if (src) {
            setAudioSrc(src);
        } 

        if (withPause) {
            // add a slight pause before each audio so it's not rushed
            // setTimeout(function () { audioElement.play() }, 2000);
            setTimeout(playAudioPromise, 2000);
        } else {
            //audioElement.play();
            playAudioPromise();
        }
    };

    function pauseAudio () {
        audioElement.pause();
    };

    function stopAudio () {
        audioElement.stop();
        fileSrc = '';
    };

    function toggleAudio () {
        if (!fileSrc || fileSrc === '') return;
        
        if (audioElement.paused) {
            audioElement.play();
        } else {
            pauseAudio();
        }
    }

    return {
        setAudioSource: setAudioSrc,
        play: playAudio,
        pause: pauseAudio,
        stop: stopAudio,
        toggle: toggleAudio
    }
};
